// Logs service - business logic layer
const logsRepository = require("../repositories/logs_repository");
const { logger } = require("../../logging");
const { ValidationError } = require("../../errors/validation_error");
const Log = require("../../db/models/log.model");

const validateLogData = function (data) {
  const tempLog = new Log(data);
  const validationError = tempLog.validateSync();

  if (validationError) {
    const firstErrorKey = Object.keys(validationError.errors)[0];
    const firstError = validationError.errors[firstErrorKey];
    throw new ValidationError(firstError.message);
  }

  return tempLog;
};

const createLog = async function (logData) {
  const validatedLog = validateLogData(logData);

  try {
    const log = await logsRepository.createLog({
      level: validatedLog.level,
      message: validatedLog.message,
      timestamp: validatedLog.timestamp || new Date(),
      method: validatedLog.method,
      url: validatedLog.url,
      statusCode: validatedLog.statusCode,
      responseTime: validatedLog.responseTime,
    });

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

const getAllLogs = async function () {
  const logs = await logsRepository.findAllLogs();

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
