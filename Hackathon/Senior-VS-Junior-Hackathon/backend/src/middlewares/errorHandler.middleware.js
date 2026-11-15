import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';
  let errors = err.errors || [];

  // Zod Validation Error
  if (err instanceof ZodError || err.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = err.issues ? err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    })) : [];
  }
  // Mongoose CastError (Invalid ObjectId)
  else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
    errors = [];
  }
  // Mongoose Duplicate Key Error (Code 11000)
  else if (err.code === 11000) {
    statusCode = 409;
    const fields = Object.keys(err.keyValue || {}).join(', ');
    message = `Duplicate value entered for: ${fields}`;
    errors = [];
  }
  // General unhandled internal errors
  else if (!(err instanceof ApiError)) {
    if (env.NODE_ENV === 'production') {
      message = 'Internal server error';
    }
  }

  // Log server errors (5xx)
  if (statusCode >= 500) {
    logger.error({ err, path: req.originalUrl, method: req.method }, 'Server Error');
  }

  const response = {
    success: false,
    message,
    errors,
  };

  // Stack trace is only exposed in non-production environments
  if (env.NODE_ENV !== 'production' && err.stack) {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};
