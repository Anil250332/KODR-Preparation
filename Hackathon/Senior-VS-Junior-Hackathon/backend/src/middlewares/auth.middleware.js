import { ApiError } from '../utils/ApiError.js';

/**
 * Authentication middleware blueprint.
 * Activate and connect JWT/session verification once authentication requirements are finalized.
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authentication token missing or invalid'));
  }

  // Once JWT package is installed and secret configured:
  // const token = authHeader.split(' ')[1];
  // const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
  // req.user = decoded;

  return next();
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden: Insufficient permissions'));
    }
    return next();
  };
};
