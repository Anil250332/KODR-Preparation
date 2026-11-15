import dotenv from 'dotenv';
import { z } from 'zod';
import { logger } from '../lib/logger.js';

dotenv.config();

const envSchema = z.object({
  PORT: z
    .string()
    .default('5000')
    .transform((val) => parseInt(val, 10)),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  MONGODB_URI: z.string().optional().default(''),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  MOCK_MODE: z
    .string()
    .optional()
    .default('false')
    .transform((val) => val === 'true'),
  JWT_ACCESS_SECRET: z.string().optional().default(''),
  JWT_REFRESH_SECRET: z.string().optional().default(''),
  IMAGEKIT_PUBLIC_KEY: z.string().optional().default(''),
  IMAGEKIT_PRIVATE_KEY: z.string().optional().default(''),
  IMAGEKIT_URL_ENDPOINT: z.string().optional().default(''),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  logger.error(
    { errors: parsedEnv.error.format() },
    'Environment variable validation failed'
  );
  process.exit(1);
}

export const env = parsedEnv.data;
