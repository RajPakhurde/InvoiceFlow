import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'dev_access_secret_key_123',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_key_123',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};

if (!config.databaseUrl) {
  console.warn('⚠️ WARNING: DATABASE_URL is not set in environment variables.');
}
