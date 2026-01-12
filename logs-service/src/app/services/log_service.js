// Logs service - business logic layer
// Handles log validation, creation, and retrieval from database
const logsRepository = require("../repositories/logs_repository");
const { logger } = require("../../logging");
const { ValidationError } = require("../../errors/validation_error");
const Log = require("../../db/models/log.model");

/**
 * Validates log data against the Log model schema
 * Ensures all required fields are present and valid
 * @param {Object} data - Log data object with level, message, method, url, statusCode, responseTime
 * @returns {Object} Validated log object
 * @throws {ValidationError} If log data fails schema validation
 */
const validateLogData = function (data) {
  // Create temporary log to validate against Mongoose schema
  const tempLog = new Log(data);
  const validationError = tempLog.validateSync();

  // If schema validation fails, extract and throw the first error
  if (validationError) {
    const firstErrorKey = Object.keys(validationError.errors)[0];
    const firstError = validationError.errors[firstErrorKey];
    throw new ValidationError(firstError.message);
  }

  return tempLog;
};

/**
 * Creates a new log entry in the database with validation
 * Formats and validates log data before persistence
 * @param {Object} logData - Log object with level, message, method, url, statusCode, responseTime
 * @returns {Promise<Object>} Formatted log response with all relevant fields
 * @throws {ValidationError} If log data is invalid
 * @throws {Error} If database operation fails
 */
const createLog = async function (logData) {
  // Validate log data against schema constraints
  const validatedLog = validateLogData(logData);

  try {
    // Persist log to database with validated and formatted data
    const log = await logsRepository.createLog({
      level: validatedLog.level,
      message: validatedLog.message,
      timestamp: validatedLog.timestamp || new Date(),
      method: validatedLog.method,
      url: validatedLog.url,
      statusCode: validatedLog.statusCode,
      responseTime: validatedLog.responseTime,
    });

    // Return formatted response with all relevant fields
    return {
      _id: log._id,
      level: log.level,
      message: log.message,
      timestamp: log.timestamp,
      method: log.method,
      url: log.url,
      statusCode: log.statusCode,
      responseTime: log.responseTime,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves all logs from the database and formats them
 * Returns logs in a consistent format for API responses
 * @returns {Promise<Array>} Array of formatted log objects
 */
const getAllLogs = async function () {
  // Fetch all logs from repository (sorted by timestamp descending)
  const logs = await logsRepository.findAllLogs();

  // Format each log with consistent field structure for response
  return logs.map((log) => ({
    _id: log._id,
    level: log.level,
    message: log.message,
    timestamp: log.timestamp,
    method: log.method,
    url: log.url,
    statusCode: log.statusCode,
    responseTime: log.responseTime,
  }));
};

module.exports = {
  createLog,
  getAllLogs,
};
