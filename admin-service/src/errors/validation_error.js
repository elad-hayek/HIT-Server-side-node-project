// Validation error (400)
const { AppError } = require("./app_error");

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
    this.name = "ValidationError";
  }
}

module.exports = { ValidationError };
