import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';
import { authMiddleware } from '../../middleware/auth.js';
import {
  getExpensesHandler,
  createExpenseHandler,
  updateExpenseHandler,
  deleteExpenseHandler,
} from './expenses.controller.js';

const router = Router();

router.use(authMiddleware);

const expenseSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  amount: z.number().positive('Amount must be a positive number'),
  date: z.string().min(1, 'Date is required'),
  note: z.string().optional().nullable(),
});

router.get('/', getExpensesHandler);
router.post('/', validate(expenseSchema), createExpenseHandler);
router.put('/:id', validate(expenseSchema), updateExpenseHandler);
router.delete('/:id', deleteExpenseHandler);

export default router;
