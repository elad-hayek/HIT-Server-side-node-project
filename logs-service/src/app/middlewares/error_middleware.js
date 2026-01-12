// Error handling middleware module - processes and formats error responses

// Map error types to standardized error IDs for client identification
const ERROR_ID_MAP = {
  ValidationError: "ERR_VALIDATION_001",
  NotFoundError: "ERR_NOT_FOUND_002",
  DuplicateError: "ERR_DUPLICATE_003",
  ServiceError: "ERR_SERVICE_004",
  AppError: "ERR_APP_005",
};

/**
 * Maps error class name to standardized error ID
 * Used to identify error types in API responses
 * @param {Error} err - Error object with constructor name
 * @returns {string} Standardized error ID string
 */
const getErrorId = function (err) {
  // Extract error type name from error class constructor
  const errorType = err.constructor.name;
  // Return mapped ID or generic unknown error code
  return ERROR_ID_MAP[errorType] || "ERR_UNKNOWN_999";
};

/**
 * Express error handling middleware
 * Catches errors and sends formatted JSON response
 * @param {Error} err - Error object thrown during request processing
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object for sending reply
 * @param {Function} next - Express next middleware function (unused in error handler)
 * @returns {void} Sends JSON response with error details
 */
const errorHandler = function (err, req, res, next) {
  // Extract HTTP status code from error or default to 500
  const status = err.status || 500;
  // Get error message or provide default message
  const message = err.message || "Internal Server Error";
  // Map error type to standardized error ID
  const errorId = getErrorId(err);

  // Attach error to response object for logging middleware
  res.err = err;

  // Send error response in JSON format with status code
  res.status(status).json({
    id: errorId,
    message: message,
  });
};

module.exports = errorHandler;
