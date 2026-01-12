// HTTP request logging middleware module - logs all HTTP requests and responses

// Import pino HTTP logging plugin for request/response tracking
const pinoHttp = require("pino-http");
// Import logger instance configured for the application
const { logger } = require("../../logging");

// Configure pino HTTP logger with custom formatting and level determination
const httpLogger = pinoHttp({
  // Use application logger instance for output
  logger,
  /**
   * Determines appropriate log level based on HTTP response status
   * Client errors (4xx) log as warnings, server errors (5xx) as errors
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Error} err - Error object if present
   * @returns {string} Log level: "info", "warn", or "error"
   */
  customLogLevel: function (req, res, err) {
    // Log client errors (400-499) as warnings
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return "warn";
    } else if (res.statusCode >= 500 || err || res.err) {
      // Log server errors (500+) and processing errors as errors
      return "error";
    }
    // Log successful requests (2xx, 3xx) as info
    return "info";
  },
  /**
   * Formats log message for successful requests
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object with status code
   * @returns {string} Formatted log message with method, path, status
   */
  customSuccessMessage: function (req, res) {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },
  /**
   * Formats log message for error responses
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Error} err - Error that occurred during request
   * @returns {string} Formatted error log with details
   */
  customErrorMessage: function (req, res, err) {
    // Extract error from parameter or response object
    const error = err || res.err;
    // Return formatted message with error details
    return `${req.method} ${req.url} ${res.statusCode} - ${error?.message}`;
  },
});

/**
 * Logging middleware function called for each HTTP request
 * Logs request/response information using pino
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Passes control to next middleware
 */
const loggingMiddleware = function (req, res, next) {
  // Call pino HTTP logger to process request/response
  httpLogger(req, res, next);
};

// Export logging middleware for use in Express app
module.exports = loggingMiddleware;
