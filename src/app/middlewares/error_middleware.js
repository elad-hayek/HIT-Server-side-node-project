// Error handling middleware
function errorHandler(err, req, res, next) {
  const requestId = req.id || req.headers["x-request-id"] || "unknown";
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    id: requestId,
    message: message,
  });
}

module.exports = errorHandler;
