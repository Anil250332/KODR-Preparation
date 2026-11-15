import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../lib/logger.js';

export const connectDB = async () => {
  if (!env.MONGODB_URI) {
    if (env.MOCK_MODE) {
      logger.warn('MONGODB_URI is not configured, but MOCK_MODE=true. Running without active database connection.');
      return null;
    }
    if (env.NODE_ENV === 'production') {
      logger.error('MONGODB_URI is required in production mode.');
      process.exit(1);
    }
    logger.warn('MONGODB_URI is empty. Set MONGODB_URI in your .env or enable MOCK_MODE=true.');
    return null;
  }

  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    logger.info(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error({ err: error.message }, 'MongoDB connection failed');
    if (env.NODE_ENV === 'production' && !env.MOCK_MODE) {
      process.exit(1);
    }
    return null;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed gracefully');
  } catch (error) {
    logger.error({ err: error.message }, 'Error closing MongoDB connection');
  }
};
