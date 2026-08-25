import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';
import { authMiddleware } from '../../middleware/auth.js';
import {
  getClientsHandler,
  getClientByIdHandler,
  createClientHandler,
  updateClientHandler,
  deleteClientHandler,
} from './clients.controller.js';

const router = Router();

// Protect all client routes
router.use(authMiddleware);

const createClientSchema = z.object({
  name: z.string().min(1, 'Client name is required'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  gstin: z.string().optional().nullable(),
});

const updateClientSchema = z.object({
  name: z.string().min(1, 'Client name is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  company: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  gstin: z.string().optional().nullable(),
});

router.get('/', getClientsHandler);
router.get('/:id', getClientByIdHandler);
router.post('/', validate(createClientSchema), createClientHandler);
router.put('/:id', validate(updateClientSchema), updateClientHandler);
router.delete('/:id', deleteClientHandler);

export default router;
