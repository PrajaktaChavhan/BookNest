import rateLimit from 'express-rate-limit';

// Applied only to auth routes (login, forgot-password) - these are the
// realistic brute-force / enumeration targets, not the whole API.
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { message: 'Too many attempts. Please try again later.', code: 'RATE_LIMITED' },
  },
});
