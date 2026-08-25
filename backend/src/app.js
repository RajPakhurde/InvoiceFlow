import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/env.js';
import { prisma } from './config/db.js';
import authRoutes from './modules/auth/auth.routes.js';
import clientsRoutes from './modules/clients/clients.routes.js';
import invoicesRoutes from './modules/invoices/invoices.routes.js';
import expensesRoutes from './modules/expenses/expenses.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health Check Route
app.get('/api/health', async (req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'ok',
      db: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// 404 Route Handler
app.use(notFoundHandler);

// Global Error Handler Middleware
app.use(errorHandler);

export default app;
