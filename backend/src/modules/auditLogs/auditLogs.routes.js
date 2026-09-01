import { Router } from 'express';
import { getAuditLogsController } from './auditLogs.controller.js';
import { authenticateToken } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateToken);
router.get('/', getAuditLogsController);

export default router;
