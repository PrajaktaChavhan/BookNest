import { env } from '../config/env.js';

// This is the LAST middleware mounted in app.js. Every error thrown anywhere
// (including inside catchAsync-wrapped controllers) ends up here.
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational || false;

  if (!isOperational) {
    // Unexpected errors get logged loudly - these are bugs, not user mistakes.
    console.error('UNEXPECTED ERROR:', err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message: isOperational ? err.message : 'Something went wrong',
      code: err.code,
      // Stack traces only leak in development - never in production responses.
      ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
}
