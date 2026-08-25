import * as invoicesService from './invoices.service.js';
import { generateInvoicePdf } from './invoice.pdf.js';
import { sendInvoiceEmail } from '../../utils/mailer.js';

export const getInvoicesHandler = async (req, res, next) => {
  try {
    const { status, clientId, page, limit } = req.query;
    const result = await invoicesService.getInvoices(req.user.id, {
      status,
      clientId,
      page,
      limit,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getInvoiceByIdHandler = async (req, res, next) => {
  try {
    const invoice = await invoicesService.getInvoiceById(req.user.id, req.params.id);
    res.status(200).json(invoice);
  } catch (error) {
    next(error);
  }
};

export const createInvoiceHandler = async (req, res, next) => {
  try {
    const invoice = await invoicesService.createInvoice(req.user.id, req.body);
    res.status(201).json(invoice);
  } catch (error) {
    next(error);
  }
};

export const updateInvoiceHandler = async (req, res, next) => {
  try {
    const invoice = await invoicesService.updateInvoice(req.user.id, req.params.id, req.body);
    res.status(200).json(invoice);
  } catch (error) {
    next(error);
  }
};

export const deleteInvoiceHandler = async (req, res, next) => {
  try {
    await invoicesService.deleteInvoice(req.user.id, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const updateInvoiceStatusHandler = async (req, res, next) => {
  try {
    const { status } = req.body;
    const invoice = await invoicesService.updateInvoiceStatus(req.user.id, req.params.id, status);
    res.status(200).json(invoice);
  } catch (error) {
    next(error);
  }
};

export const getInvoicePdfHandler = async (req, res, next) => {
  try {
    const invoice = await invoicesService.getInvoiceById(req.user.id, req.params.id);
    const pdfBuffer = await generateInvoicePdf(invoice);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${invoice.invoiceNumber || 'invoice'}.pdf"`
    );

    res.status(200).send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

export const sendInvoiceEmailHandler = async (req, res, next) => {
  try {
    const invoice = await invoicesService.getInvoiceById(req.user.id, req.params.id);

    if (!invoice.client || !invoice.client.email) {
      const error = new Error('Client email address is missing');
      error.status = 400;
      error.code = 'VALIDATION_ERROR';
      throw error;
    }

    // 1. Generate PDF
    const pdfBuffer = await generateInvoicePdf(invoice);

    // 2. Send email via Nodemailer (if SMTP fails, throws error here)
    const subject = `Invoice ${invoice.invoiceNumber} from ${invoice.client.company || 'InvoiceFlow'}`;
    const bodyText = `Hello ${invoice.client.name},\n\nPlease find attached invoice ${invoice.invoiceNumber} for $${invoice.total.toFixed(
      2
    )} due on ${new Date(invoice.dueDate).toLocaleDateString()}.\n\nThank you!`;

    await sendInvoiceEmail({
      to: invoice.client.email,
      subject,
      text: bodyText,
      pdfBuffer,
      filename: `${invoice.invoiceNumber}.pdf`,
    });

    // 3. Mark as sent only after successful email transmission
    const updatedInvoice = await invoicesService.updateInvoiceStatus(
      req.user.id,
      invoice.id,
      'sent'
    );

    res.status(200).json({
      message: 'Invoice sent',
      sentAt: updatedInvoice.sentAt,
      invoice: updatedInvoice,
    });
  } catch (error) {
    next(error);
  }
};
