import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { getSummaryHandler, getRevenueChartHandler } from './dashboard.controller.js';

const router = Router();

router.use(authMiddleware);

router.get('/summary', getSummaryHandler);
router.get('/revenue-chart', getRevenueChartHandler);

export default router;
