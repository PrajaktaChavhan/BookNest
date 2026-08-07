import { ApiError } from '../utils/ApiError.js';

// Usage: router.post('/register', validate(registerSchema), authController.register)
// Keeps controllers free of validation logic entirely - per our Phase 6 rule
// that controllers stay thin.
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return next(
        ApiError.badRequest(
          firstIssue?.message || 'Validation failed',
          'VALIDATION_ERROR'
        )
      );
    }

    // Overwrite with parsed (and coerced/defaulted) values.
    req.body = result.data.body ?? req.body;
    req.query = result.data.query ?? req.query;
    next();
  };
}
