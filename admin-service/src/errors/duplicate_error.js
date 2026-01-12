// Duplicate error module - handles resource conflict scenarios (HTTP 409)
// Used when attempting to create a resource that already exists (duplicate ID, email, etc.)

// Import base AppError class for inheritance
const { AppError } = require("./app_error");

/**
 * DuplicateError class for resource conflict/duplication scenarios
 * Extends AppError with HTTP 409 (Conflict) status code
 * Used when client attempts to create a resource with duplicate unique fields
 */
class DuplicateError extends AppError {
  /**
   * Constructor for creating duplicate error instances
   * @param {string} message - Human-readable error description of the duplication
   */
  constructor(message) {
    // Call parent with message and HTTP 409 Conflict status
    super(message, 409);
    // Set error name for debugging and error identification
    this.name = "DuplicateError";
  }
}

// Export DuplicateError class for use in services and controllers
module.exports = { DuplicateError };
