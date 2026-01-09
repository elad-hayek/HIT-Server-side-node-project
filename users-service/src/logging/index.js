// Pino logger configuration with MongoDB stream
const pino = require("pino");
const loggingClient = require("../clients/logging_client");

// Custom stream to send logs to REST API via loggingClient
const customStream = {
  write: (msg) => {
    try {
      // TODO: elad - remove
      // console.clear()

      // Parse log message from pino (JSON string)
      const logObj = JSON.parse(msg);

      // Send to logging service as 'custom' log
      loggingClient.createLog({
        level: logObj.level,
        message: logObj.msg,
        timestamp: new Date(logObj.time),
        method: logObj.req?.method,
        url: logObj.req?.url,
        statusCode: logObj.res?.statusCode,
        responseTime: logObj.responseTime,
      });
    } catch (err) {
      // Fallback: log error to console
      console.error("Failed to send log:", err.message);
    }
  },
};

const logger = pino(
  { level: "info" },
  pino.multistream([
    { level: "info", stream: process.stdout },
    { level: "info", stream: customStream },
  ])
);

module.exports = { logger };
