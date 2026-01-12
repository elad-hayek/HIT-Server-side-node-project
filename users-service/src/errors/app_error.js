// Base application error class - foundation for all custom error types
// All custom errors in the application extend this class
// Provides consistent error handling with HTTP status codes

/**
 * AppError class - Base class for all application-specific errors
 * Extends native Error class with HTTP status code support
 * Used as parent class for ValidationError, NotFoundError, DuplicateError, ServiceError
 */
class AppError extends Error {
  /**
   * Constructor for creating application error instances
   * @param {string} message - Human-readable error description for debugging and client response
   * @param {number} status - HTTP status code (e.g., 400, 404, 409, 502, 503)
   */
  constructor(message, status) {
    // Call parent Error constructor with message
    super(message);
    // Store HTTP status code for response handling
    this.status = status;
  }
}

// Export AppError class for inheritance by other error classes
module.exports = { AppError };
