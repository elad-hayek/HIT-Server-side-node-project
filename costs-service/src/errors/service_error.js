// Service error module - handles inter-service communication failures (HTTP 502/503)
// Used when external services (users, costs, logging) are unavailable or fail

// Import base AppError class for inheritance
const { AppError } = require("./app_error");

/**
 * ServiceError class for inter-service communication failures
 * Extends AppError with configurable HTTP status code (default 502 Bad Gateway)
 * Used when external services are unreachable, timeout, or return errors
 */
class ServiceError extends AppError {
  /**
   * Constructor for creating service error instances
   * @param {string} message - Human-readable error description of service failure
   * @param {number} status - HTTP status code (502 Bad Gateway or 503 Service Unavailable), default 502
   */
  constructor(message, status = 502) {
    // Call parent with message and provided or default HTTP 502 status
    super(message, status);
    // Set error name for debugging and error identification
    this.name = "ServiceError";
  }
}

// Export ServiceError class for use in services and controllers
module.exports = { ServiceError };
