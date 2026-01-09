// Service error (502/503)
const { AppError } = require("./app_error");

class ServiceError extends AppError {
  constructor(message, status = 502) {
    super(message, status);
    this.name = "ServiceError";
  }
}

module.exports = { ServiceError };
