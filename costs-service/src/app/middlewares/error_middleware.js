// Error handling middleware
const ERROR_ID_MAP = {
  ValidationError: "ERR_VALIDATION_001",
  NotFoundError: "ERR_NOT_FOUND_002",
  DuplicateError: "ERR_DUPLICATE_003",
  ServiceError: "ERR_SERVICE_004",
  AppError: "ERR_APP_005",
};

function getErrorId(err) {
  const errorType = err.constructor.name;
  return ERROR_ID_MAP[errorType] || "ERR_UNKNOWN_999";
}

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  const errorId = getErrorId(err);

  // Attach error to response so pinoHttp recognizes it
  res.err = err;

  res.status(status).json({
    id: errorId,
    message: message,
  });
}

module.exports = errorHandler;
