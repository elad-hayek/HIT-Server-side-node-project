// Not found error (404)
const { AppError } = require("./app_error");

class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

module.exports = { NotFoundError };
