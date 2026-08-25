import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';
import { authMiddleware } from '../../middleware/auth.js';
import {
  getInvoicesHandler,
  getInvoiceByIdHandler,
  createInvoiceHandler,
  updateInvoiceHandler,
  deleteInvoiceHandler,
  updateInvoiceStatusHandler,
  getInvoicePdfHandler,
  sendInvoiceEmailHandler,
} from './invoices.controller.js';

const router = Router();

router.use(authMiddleware);

const itemSchema = z.object({
  description: z.string().min(1, 'Item description is required'),
  quantity: z.number().positive('Quantity must be a positive number'),
  rate: z.number().nonnegative('Rate cannot be negative'),
});

const invoiceSchema = z
  .object({
    clientId: z.string().uuid('Invalid client ID'),
    issueDate: z.string().min(1, 'Issue date is required'),
    dueDate: z.string().min(1, 'Due date is required'),
    taxPercent: z.number().nonnegative().optional().default(0),
    items: z.array(itemSchema).min(1, 'Invoice must contain at least one line item'),
    notes: z.string().optional().nullable(),
  })
  .refine(
    (data) => new Date(data.dueDate) >= new Date(data.issueDate),
    {
      message: 'Due date must be on or after issue date',
      path: ['dueDate'],
    }
  );

const statusSchema = z.object({
  status: z.enum(['draft', 'sent', 'paid', 'overdue'], {
    errorMap: () => ({ message: 'Status must be draft, sent, paid, or overdue' }),
  }),
});

router.get('/', getInvoicesHandler);
router.get('/:id', getInvoiceByIdHandler);
router.get('/:id/pdf', getInvoicePdfHandler);
router.post('/', validate(invoiceSchema), createInvoiceHandler);
router.put('/:id', validate(invoiceSchema), updateInvoiceHandler);
router.delete('/:id', deleteInvoiceHandler);
router.patch('/:id/status', validate(statusSchema), updateInvoiceStatusHandler);
router.post('/:id/send', sendInvoiceEmailHandler);

export default router;
