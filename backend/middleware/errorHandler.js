// Global JSON error handler
// Ensures every backend error returns valid JSON with no empty bodies

function errorHandler(err, req, res, next) {
  console.error('[SERVER ERROR]', err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'An unexpected server error occurred';

  res.status(status).json({
    error: message,
    status,
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({
    error: `Route ${req.method} ${req.originalUrl} not found`,
    status: 404,
  });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
