const pino = require("pino");
const loggingClient = require("../clients/logging_client");

// Custom stream to send logs to REST API via loggingClient
const customStream = {
  write: (msg) => {
    try {
      // Parse log message from pino (JSON string)
      const logObj = JSON.parse(msg);
      // Send to logging service as 'custom' log
      loggingClient.logCustom(logObj.level, logObj.msg, logObj);
    } catch (err) {
      // Fallback: log error to console
      console.error("Failed to send log to logging service:", err.message);
    }
  },
};

const logger = pino({}, customStream);

module.exports = logger;
