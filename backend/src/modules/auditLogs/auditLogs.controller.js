import * as auditLogsService from './auditLogs.service.js';

export const getAuditLogsController = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page, limit } = req.query;
    const data = await auditLogsService.getUserAuditLogs(userId, { page, limit });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
