// Application error class module - defines base error for application

/**
 * Base error class for all application errors
 * Extends native JavaScript Error to add HTTP status codes
 * All custom errors should inherit from this class
 */
class AppError extends Error {
  /**
   * Constructor for creating application error instances
   * @param {string} message - Human-readable error description
   * @param {number} status - HTTP status code (default 500)
   */
  constructor(message, status) {
    // Call parent Error constructor with message
    super(message);
    // Store HTTP status code for response handling
    this.status = status;
  }
}

// Export AppError class for inheritance by specific error types
module.exports = { AppError };
