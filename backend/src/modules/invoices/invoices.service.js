import { prisma } from '../../config/db.js';
import { generateInvoiceNumber } from '../../utils/invoiceNumber.js';

export const getInvoices = async (userId, { status, clientId, page = 1, limit = 20 }) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 20);
  const skip = (pageNum - 1) * limitNum;

  const where = { userId };
  if (status && status !== 'all') {
    where.status = status;
  }
  if (clientId) {
    where.clientId = clientId;
  }

  const [data, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        invoiceNumber: true,
        status: true,
        issueDate: true,
        dueDate: true,
        taxPercent: true,
        subtotal: true,
        taxAmount: true,
        total: true,
        sentAt: true,
        paidAt: true,
        createdAt: true,
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
      },
    }),
    prisma.invoice.count({ where }),
  ]);

  // Format response per API spec
  const formattedData = data.map((inv) => ({
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    clientName: inv.client ? inv.client.name : 'Unknown Client',
    clientId: inv.client ? inv.client.id : null,
    clientCompany: inv.client ? inv.client.company : null,
    status: inv.status,
    total: Number(inv.total),
    dueDate: inv.dueDate,
    issueDate: inv.issueDate,
    createdAt: inv.createdAt,
  }));

  return {
    data: formattedData,
    total,
    page: pageNum,
    limit: limitNum,
  };
};

export const getInvoiceById = async (userId, invoiceId) => {
  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      userId,
    },
    include: {
      items: true,
      client: true,
    },
  });

  if (!invoice) {
    const error = new Error('Invoice not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  return {
    ...invoice,
    subtotal: Number(invoice.subtotal),
    taxAmount: Number(invoice.taxAmount),
    total: Number(invoice.total),
    items: invoice.items.map((item) => ({
      ...item,
      rate: Number(item.rate),
      amount: Number(item.amount),
    })),
  };
};

export const createInvoice = async (userId, data) => {
  // 1. Verify client exists and belongs to user
  const client = await prisma.client.findFirst({
    where: { id: data.clientId, userId },
  });

  if (!client) {
    const error = new Error('Client not found or access denied');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  // 2. Process line items and compute totals
  const itemsWithAmount = data.items.map((item) => {
    const quantity = Number(item.quantity);
    const rate = Number(item.rate);
    const amount = quantity * rate;
    return {
      description: item.description,
      quantity,
      rate,
      amount,
    };
  });

  const subtotal = itemsWithAmount.reduce((sum, item) => sum + item.amount, 0);
  const taxPercent = Number(data.taxPercent || 0);
  const taxAmount = subtotal * (taxPercent / 100);
  const total = subtotal + taxAmount;

  // 3. Create invoice with auto-generated number in a transaction
  const created = await prisma.$transaction(async (tx) => {
    const invoiceNumber = await generateInvoiceNumber(userId, tx);

    return await tx.invoice.create({
      data: {
        userId,
        clientId: data.clientId,
        invoiceNumber,
        status: 'draft',
        issueDate: new Date(data.issueDate),
        dueDate: new Date(data.dueDate),
        taxPercent,
        subtotal,
        taxAmount,
        total,
        notes: data.notes || null,
        items: {
          create: itemsWithAmount,
        },
      },
      include: {
        items: true,
        client: true,
      },
    });
  });

  return {
    ...created,
    subtotal: Number(created.subtotal),
    taxAmount: Number(created.taxAmount),
    total: Number(created.total),
    items: created.items.map((item) => ({
      ...item,
      rate: Number(item.rate),
      amount: Number(item.amount),
    })),
  };
};

export const updateInvoice = async (userId, invoiceId, data) => {
  // 1. Verify invoice exists and status is draft
  const existing = await prisma.invoice.findFirst({
    where: { id: invoiceId, userId },
  });

  if (!existing) {
    const error = new Error('Invoice not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  if (existing.status !== 'draft') {
    const error = new Error('Only draft invoices can be edited');
    error.status = 400;
    error.code = 'INVALID_STATUS';
    throw error;
  }

  // 2. Verify client if changed
  if (data.clientId && data.clientId !== existing.clientId) {
    const client = await prisma.client.findFirst({
      where: { id: data.clientId, userId },
    });
    if (!client) {
      const error = new Error('Client not found or access denied');
      error.status = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }
  }

  // 3. Process line items and compute totals
  const itemsWithAmount = data.items.map((item) => {
    const quantity = Number(item.quantity);
    const rate = Number(item.rate);
    const amount = quantity * rate;
    return {
      description: item.description,
      quantity,
      rate,
      amount,
    };
  });

  const subtotal = itemsWithAmount.reduce((sum, item) => sum + item.amount, 0);
  const taxPercent = Number(data.taxPercent !== undefined ? data.taxPercent : existing.taxPercent);
  const taxAmount = subtotal * (taxPercent / 100);
  const total = subtotal + taxAmount;

  // 4. Update invoice in a transaction (replace items)
  const updated = await prisma.$transaction(async (tx) => {
    // Delete existing line items
    await tx.invoiceItem.deleteMany({
      where: { invoiceId },
    });

    return await tx.invoice.update({
      where: { id: invoiceId },
      data: {
        clientId: data.clientId || existing.clientId,
        issueDate: data.issueDate ? new Date(data.issueDate) : existing.issueDate,
        dueDate: data.dueDate ? new Date(data.dueDate) : existing.dueDate,
        taxPercent,
        subtotal,
        taxAmount,
        total,
        notes: data.notes !== undefined ? data.notes : existing.notes,
        items: {
          create: itemsWithAmount,
        },
      },
      include: {
        items: true,
        client: true,
      },
    });
  });

  return {
    ...updated,
    subtotal: Number(updated.subtotal),
    taxAmount: Number(updated.taxAmount),
    total: Number(updated.total),
    items: updated.items.map((item) => ({
      ...item,
      rate: Number(item.rate),
      amount: Number(item.amount),
    })),
  };
};

export const deleteInvoice = async (userId, invoiceId) => {
  const existing = await prisma.invoice.findFirst({
    where: { id: invoiceId, userId },
  });

  if (!existing) {
    const error = new Error('Invoice not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  await prisma.invoice.delete({
    where: { id: invoiceId },
  });

  return { success: true };
};

export const updateInvoiceStatus = async (userId, invoiceId, newStatus) => {
  const existing = await prisma.invoice.findFirst({
    where: { id: invoiceId, userId },
  });

  if (!existing) {
    const error = new Error('Invoice not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  const updateData = { status: newStatus };
  const now = new Date();

  if (newStatus === 'sent' && !existing.sentAt) {
    updateData.sentAt = now;
  } else if (newStatus === 'paid') {
    if (!existing.sentAt) {
      updateData.sentAt = now;
    }
    updateData.paidAt = now;
  }

  const updated = await prisma.invoice.update({
    where: { id: invoiceId },
    data: updateData,
    include: {
      items: true,
      client: true,
    },
  });

  return {
    ...updated,
    subtotal: Number(updated.subtotal),
    taxAmount: Number(updated.taxAmount),
    total: Number(updated.total),
    items: updated.items.map((item) => ({
      ...item,
      rate: Number(item.rate),
      amount: Number(item.amount),
    })),
  };
};
