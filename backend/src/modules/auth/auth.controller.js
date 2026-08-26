import * as authService from './auth.service.js';

const isProd = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const registerController = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.register(req.body);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.status(201).json({ user, accessToken });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
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

export const logoutController = (req, res) => {
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
