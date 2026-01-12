// Service error module - handles inter-service communication failures (HTTP 502/503)
// Used when dependent microservices are unavailable, timeout, or return errors

// Import base AppError class for inheritance
const { AppError } = require("./app_error");

/**
 * ServiceError class for inter-service communication failures
 * Extends AppError with configurable HTTP status code (default 502 Bad Gateway)
 * Used when calling other microservices (costs-service, logging-service) fails
 * HTTP 502 - Bad Gateway: Service received invalid response from upstream
 * HTTP 503 - Service Unavailable: Upstream service is down or timing out
 */
class ServiceError extends AppError {
  /**
   * Constructor for creating service error instances
   * @param {string} message - Human-readable description of service failure
   * @param {number} status - HTTP status code (default 502 for bad gateway, can be 503 for unavailable)
   */
  constructor(message, status = 502) {
    // Call parent with message and HTTP status code (502 or 503)
    super(message, status);
    // Set error name for debugging and error identification
    this.name = "ServiceError";
  }
}

// Export ServiceError class for use in services and controllers
module.exports = { ServiceError };
