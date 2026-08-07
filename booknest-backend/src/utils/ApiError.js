// A single error shape used everywhere in the app, so the error-handling
// middleware (Phase 8's consistent response envelope) always knows what to expect.
export class ApiError extends Error {
  constructor(statusCode, message, code = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true; // distinguishes expected errors from real bugs
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, code) {
    return new ApiError(400, message, code);
  }
  static unauthorized(message = 'Not authenticated') {
    return new ApiError(401, message, 'UNAUTHENTICATED');
  }
  static forbidden(message = 'Not allowed to perform this action') {
    return new ApiError(403, message, 'FORBIDDEN');
  }
  static notFound(message = 'Resource not found') {
    return new ApiError(404, message, 'NOT_FOUND');
  }
  static conflict(message, code) {
    return new ApiError(409, message, code);
  }
}
