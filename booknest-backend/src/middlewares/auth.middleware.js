import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { User } from '../modules/users/user.model.js';

// Reads the JWT from the httpOnly cookie (per our Phase 8 decision to avoid
// localStorage/XSS-exposed tokens), verifies it, and attaches the user.
export const authenticate = catchAsync(async (req, res, next) => {
  const token = req.cookies?.[env.COOKIE_NAME];

  if (!token) {
    throw ApiError.unauthorized('Please log in to continue');
  }

  let payload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET);
  } catch {
    throw ApiError.unauthorized('Session expired, please log in again');
  }

  const user = await User.findById(payload.sub).select('-passwordHash');
  if (!user) {
    throw ApiError.unauthorized('User no longer exists');
  }
  if (user.isSuspended) {
    throw ApiError.forbidden('This account has been suspended');
  }

  req.user = user;
  next();
});
