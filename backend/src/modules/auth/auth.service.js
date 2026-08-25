import bcrypt from 'bcrypt';
import { prisma } from '../../config/db.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt.js';

export const register = async ({ name, email, password, companyName }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    const error = new Error('User with this email already exists');
    error.status = 409;
    error.code = 'CONFLICT';
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      passwordHash,
      companyName: companyName || null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      companyName: true,
      createdAt: true,
    },
  });

  const accessToken = generateAccessToken({ id: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ id: user.id });

  return { user, accessToken, refreshToken };
};

export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    error.code = 'UNAUTHORIZED';
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    error.code = 'UNAUTHORIZED';
    throw error;
  }

  const userProfile = {
    id: user.id,
    name: user.name,
    email: user.email,
    companyName: user.companyName,
    createdAt: user.createdAt,
  };

  const accessToken = generateAccessToken({ id: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ id: user.id });

  return { user: userProfile, accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    const error = new Error('Refresh token is required');
    error.status = 401;
    error.code = 'UNAUTHORIZED';
    throw error;
  }

  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    const error = new Error('Invalid or expired refresh token');
    error.status = 401;
    error.code = 'UNAUTHORIZED';
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    const error = new Error('User not found');
    error.status = 401;
    error.code = 'UNAUTHORIZED';
    throw error;
  }

  const accessToken = generateAccessToken({ id: user.id, email: user.email });

  return { accessToken };
};

export const getCurrentUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      companyName: true,
      createdAt: true,
    },
  });

  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  return user;
};
