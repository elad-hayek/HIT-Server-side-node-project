// Error handling middleware
function errorHandler(err, req, res, next) {
  const requestId = req.id || req.headers["x-request-id"] || "unknown";
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  // Attach error to response so pinoHttp recognizes it
  res.err = err;

  res.status(status).json({
    id: requestId, // TODO: return error id
    message: message,
  });
}

module.exports = errorHandler;
