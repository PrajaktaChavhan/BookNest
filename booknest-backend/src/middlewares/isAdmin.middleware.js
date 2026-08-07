import { ApiError } from '../utils/ApiError.js';

// Must run AFTER authenticate - relies on req.user already being set.
export function isAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return next(ApiError.forbidden('Admin access required'));
  }
  next();
}
