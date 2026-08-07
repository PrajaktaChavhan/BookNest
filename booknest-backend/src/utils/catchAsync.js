// Without this, every async controller needs its own try/catch to forward
// errors to Express's error handler. This wrapper does it once, everywhere.
export function catchAsync(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
