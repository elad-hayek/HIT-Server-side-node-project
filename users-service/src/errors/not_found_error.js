// Not found error module - handles resource not found scenarios (HTTP 404)
// Used when a requested user, cost, log, or other resource does not exist

// Import base AppError class for inheritance
const { AppError } = require("./app_error");

/**
 * NotFoundError class for resource not found scenarios
 * Extends AppError with HTTP 404 (Not Found) status code
 * Used when trying to access, update, or delete a resource that doesn't exist
 */
class NotFoundError extends AppError {
  /**
   * Constructor for creating not found error instances
   * @param {string} message - Human-readable description of what resource was not found
   */
  constructor(message) {
    // Call parent with message and HTTP 404 Not Found status
    super(message, 404);
    // Set error name for debugging and error identification
    this.name = "NotFoundError";
  }
}

// Export NotFoundError class for use in services and controllers
module.exports = { NotFoundError };
