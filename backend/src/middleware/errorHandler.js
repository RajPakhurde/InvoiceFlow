import { ZodError } from 'zod';

export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.status = 404;
  error.code = 'NOT_FOUND';
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  // Log full error stack server-side for diagnostics
  console.error(`[Error Handler] ${req.method} ${req.originalUrl}:`, err);

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const issueMessages = err.errors.map((e) => e.message).join('; ');
    return res.status(400).json({
      error: {
        message: issueMessages || 'Validation error',
        code: 'VALIDATION_ERROR',
      },
    });
  }

  // Handle Prisma Known Errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: {
        message: 'A record with this unique value already exists.',
        code: 'CONFLICT',
      },
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: {
        message: 'Requested record was not found.',
        code: 'NOT_FOUND',
      },
    });
  }

  // Standardized Custom Errors
  const status = err.status || 500;
  const code = err.code || (status === 500 ? 'INTERNAL_SERVER_ERROR' : 'ERROR');
  const message = status === 500 && !err.status ? 'An unexpected server error occurred.' : (err.message || 'Error occurred');

  return res.status(status).json({
    error: {
      message,
      code,
    },
  });
};
