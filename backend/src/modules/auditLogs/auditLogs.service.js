import { prisma } from '../../config/db.js';

/**
 * Record a login/logout audit log entry
 */
export const createAuditLog = async ({ userId, action, ipAddress, userAgent }) => {
  if (!userId) return null;

  try {
    const log = await prisma.auditLog.create({
      data: {
        userId,
        action,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
      },
    });
    return log;
  } catch (error) {
    console.error('Failed to create audit log:', error.message);
    return null;
  }
};

/**
 * Get paginated audit logs for a specific user
 */
export const getUserAuditLogs = async (userId, { page = 1, limit = 15 }) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 15));
  const skip = (pageNum - 1) * limitNum;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
      select: {
        id: true,
        action: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
      },
    }),
    prisma.auditLog.count({
      where: { userId },
    }),
  ]);

  const totalPages = Math.ceil(total / limitNum) || 1;

  return {
    logs,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    },
  };
};
