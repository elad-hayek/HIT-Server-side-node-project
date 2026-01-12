// Validation error module - handles request validation failures (HTTP 400)
// Used when input data fails schema validation or constraint checks

// Import base AppError class for inheritance
const { AppError } = require("./app_error");

/**
 * ValidationError class for data validation failures
 * Extends AppError with HTTP 400 (Bad Request) status code
 * Used when client sends invalid data that fails validation rules
 */
class ValidationError extends AppError {
  /**
   * Constructor for creating validation error instances
   * @param {string} message - Human-readable error description of validation failure
   */
  constructor(message) {
    // Call parent with message and HTTP 400 Bad Request status
    super(message, 400);
    // Set error name for debugging and error identification
    this.name = "ValidationError";
  }
}

// Export ValidationError class for use in services and controllers
module.exports = { ValidationError };
