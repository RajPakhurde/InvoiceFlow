import * as authService from './auth.service.js';
import { createAuditLog } from '../auditLogs/auditLogs.service.js';
import { verifyAccessToken, verifyRefreshToken } from '../../utils/jwt.js';

const isProd = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const getClientDetails = (req) => {
  const ipAddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || req.socket?.remoteAddress;
  const userAgent = req.headers['user-agent'];
  return { ipAddress, userAgent };
};

export const registerController = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.register(req.body);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

    // Record LOGIN audit log on registration
    const clientDetails = getClientDetails(req);
    await createAuditLog({
      userId: user.id,
      email: user.email,
      action: 'LOGIN',
      ...clientDetails,
    });

    res.status(201).json({ user, accessToken });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

    // Record LOGIN audit log
    const clientDetails = getClientDetails(req);
    await createAuditLog({
      userId: user.id,
      email: user.email,
      action: 'LOGIN',
      ...clientDetails,
    });

    res.status(200).json({ user, accessToken });
  } catch (error) {
    next(error);
  }
};

export const refreshController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    const { accessToken } = await authService.refreshAccessToken(refreshToken);
    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (req, res) => {
  try {
    let userId = req.user?.id;
    let email = req.user?.email;

    if (!userId) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const decoded = verifyAccessToken(token);
        if (decoded) {
          userId = decoded.id;
          email = decoded.email;
        }
      }
    }

    if (!userId && req.cookies?.refreshToken) {
      const decodedRefresh = verifyRefreshToken(req.cookies.refreshToken);
      if (decodedRefresh) {
        userId = decodedRefresh.id;
      }
    }

    if (userId && !email) {
      try {
        const u = await authService.getCurrentUser(userId);
        if (u) email = u.email;
      } catch (e) {}
    }

    if (userId) {
      const clientDetails = getClientDetails(req);
      await createAuditLog({
        userId,
        email: email || null,
        action: 'LOGOUT',
        ...clientDetails,
      });
    }
  } catch (err) {
    console.error('Audit log logout recording error:', err.message);
  }

  res.clearCookie('refreshToken', COOKIE_OPTIONS);
  res.status(200).json({ message: 'Logged out' });
};

export const meController = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
