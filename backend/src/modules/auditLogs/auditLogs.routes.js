import { Router } from 'express';
import { getAuditLogsController } from './auditLogs.controller.js';
import { authMiddleware } from '../../middleware/auth.js';

const router = Router();

router.use(authMiddleware);
router.get('/', getAuditLogsController);

export default router;
