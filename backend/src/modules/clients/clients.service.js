import { prisma } from '../../config/db.js';

export const getClients = async (userId, options = {}) => {
  const search = typeof options === 'string' ? options : options.search || '';
  const page = typeof options === 'object' && options.page ? options.page : 1;
  const limit = typeof options === 'object' && options.limit ? options.limit : 10;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = limit === 'all' ? undefined : Math.max(1, parseInt(limit, 10) || 10);

  const where = { userId };

  if (search && search.trim() !== '') {
    const query = search.trim();
    where.OR = [
      { name: { contains: query } },
      { email: { contains: query } },
      { company: { contains: query } },
    ];
  }

  const findOptions = {
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      company: true,
      address: true,
      gstin: true,
      createdAt: true,
      updatedAt: true,
    },
  };

  if (limitNum !== undefined) {
    findOptions.skip = (pageNum - 1) * limitNum;
    findOptions.take = limitNum;
  }

  const [clients, total] = await Promise.all([
    prisma.client.findMany(findOptions),
    prisma.client.count({ where }),
  ]);

  return {
    data: clients,
    total,
    page: pageNum,
    limit: limitNum || total,
  };
};

export const getClientById = async (userId, clientId) => {
  const client = await prisma.client.findFirst({
    where: {
      id: clientId,
      userId,
    },
    include: {
      invoices: {
        select: {
          id: true,
          invoiceNumber: true,
          status: true,
          total: true,
          issueDate: true,
          dueDate: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!client) {
    const error = new Error('Client not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  // Compute invoice summary statistics
  const totalInvoices = client.invoices.length;
  const totalInvoicedAmount = client.invoices.reduce((sum, inv) => sum + inv.total, 0);

  return {
    ...client,
    summary: {
      totalInvoices,
      totalInvoicedAmount,
    },
  };
};

export const createClient = async (userId, data) => {
  return await prisma.client.create({
    data: {
      userId,
      name: data.name,
      email: data.email.toLowerCase(),
      company: data.company || null,
      address: data.address || null,
      gstin: data.gstin || null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      company: true,
      address: true,
      gstin: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const updateClient = async (userId, clientId, data) => {
  const existing = await prisma.client.findFirst({
    where: { id: clientId, userId },
  });

  if (!existing) {
    const error = new Error('Client not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  return await prisma.client.update({
    where: { id: clientId },
    data: {
      name: data.name !== undefined ? data.name : existing.name,
      email: data.email !== undefined ? data.email.toLowerCase() : existing.email,
      company: data.company !== undefined ? data.company : existing.company,
      address: data.address !== undefined ? data.address : existing.address,
      gstin: data.gstin !== undefined ? data.gstin : existing.gstin,
    },
    select: {
      id: true,
      name: true,
      email: true,
      company: true,
      address: true,
      gstin: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const deleteClient = async (userId, clientId) => {
  const existing = await prisma.client.findFirst({
    where: { id: clientId, userId },
    include: {
      _count: {
        select: { invoices: true },
      },
    },
  });

  if (!existing) {
    const error = new Error('Client not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  if (existing._count.invoices > 0) {
    const error = new Error('Cannot delete client with existing invoices');
    error.status = 409;
    error.code = 'CONFLICT';
    throw error;
  }

  await prisma.client.delete({
    where: { id: clientId },
  });

  return { success: true };
};
