import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { config } from './env.js';

const adapter = new PrismaMariaDb(config.databaseUrl);

export const prisma = new PrismaClient({ adapter });
