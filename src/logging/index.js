// Pino logger configuration with MongoDB stream
const pino = require("pino");
const createMongoStream = require("./mongo-stream");
const loggingClient = require("../clients/logging_client");

// Create a multi-stream logger that writes to both console and MongoDB
const loggerServiceLogger = pino(
  {
    level: "info",
  },
  pino.multistream([
    // Stream 1: Write to console (pretty print in development)
    {
      level: "info",
      stream: process.stdout,
    },
    // Stream 2: Write to MongoDB
    {
      level: "info",
      stream: createMongoStream(),
    },
  ])
);

// Custom stream to send logs to REST API via loggingClient
const customStream = {
  write: (msg) => {
    try {
      // Parse log message from pino (JSON string)
      const logObj = JSON.parse(msg);
      const customData = logObj.req?.customLogData || {};

      // Send to logging service as 'custom' log
      loggingClient.createLog({
        level: logObj.level,
        message: logObj.msg,
        timestamp: new Date(logObj.time),
        method: customData.method,
        url: customData.url,
        statusCode: customData.statusCode,
        responseTime: customData.responseTime,
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

module.exports = { logger, loggerServiceLogger };
