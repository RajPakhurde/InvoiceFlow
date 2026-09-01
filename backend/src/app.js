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
import auditLogsRoutes from './modules/auditLogs/auditLogs.routes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://invoiceflow.rajpakhurde.in',
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);

      // Check against allowed origins list or wildcard
      const isAllowed = allowedOrigins.some((allowed) => {
        if (!allowed) return false;
        const cleanAllowed = allowed.replace(/\/$/, '');
        const cleanOrigin = origin.replace(/\/$/, '');
        return cleanAllowed === cleanOrigin || cleanAllowed === '*';
      });

      if (isAllowed || process.env.FRONTEND_URL === '*') {
        return callback(null, true);
      }

      // Dynamic fallback for matching subdomain requests
      if (origin.endsWith('.rajpakhurde.in')) {
        return callback(null, true);
      }

      return callback(null, true);
    },
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
app.use('/api/audit-logs', auditLogsRoutes);

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
