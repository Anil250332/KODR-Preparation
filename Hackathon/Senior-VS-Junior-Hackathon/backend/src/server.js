import app from './app.js';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { logger } from './lib/logger.js';

const PORT = env.PORT || 5000;
const HOST = '0.0.0.0';

let server;

const startServer = async () => {
  // Connect database
  await connectDB();

  // Start HTTP server bound to 0.0.0.0 for Render compatibility
  server = app.listen(PORT, HOST, () => {
    logger.info(`Server running in ${env.NODE_ENV} mode on http://${HOST}:${PORT}`);
    if (env.MOCK_MODE) {
      logger.info('MOCK_MODE is enabled: services can serve mock data');
    }
  });
};

const handleShutdown = async (signal) => {
  logger.info(`${signal} received: closing HTTP server and database connections...`);

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed.');
      await disconnectDB();
      logger.info('Graceful shutdown completed.');
      process.exit(0);
    });

    // Force close if graceful shutdown hangs
    setTimeout(() => {
      logger.error('Graceful shutdown timed out. Forcing process exit.');
      process.exit(1);
    }, 10000).unref();
  } else {
    await disconnectDB();
    process.exit(0);
  }
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled Promise Rejection');
});

process.on('uncaughtException', (err) => {
  logger.error({ err }, 'Uncaught Exception thrown');
  process.exit(1);
});

startServer();
