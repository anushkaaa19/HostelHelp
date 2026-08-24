/**
 * Wraps an async route handler so any thrown error / rejected promise is
 * passed to Express's next(err), reaching the centralized error handler
 * in server.js instead of crashing the process or requiring a try/catch
 * in every controller.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
