// Pino logger configuration with MongoDB stream
const pino = require("pino");
const createMongoStream = require("./mongo-stream");

// Create a multi-stream logger that writes to both console and MongoDB
// Note: Logs service does NOT send logs to itself to avoid infinite loops
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

// Custom stream to write directly to MongoDB (no external service call)
const customStream = {
  write: (msg) => {
    try {
      // Parse log message from pino (JSON string)
      const logObj = JSON.parse(msg);

      // In the logs service, we just log to MongoDB directly
      // No external HTTP calls to avoid infinite loops
      const Log = require("../db/models/log.model");

      const logDoc = new Log({
        level: logObj.level,
        message: logObj.msg,
        timestamp: new Date(logObj.time),
        method: logObj.req?.method,
        url: logObj.req?.url,
        statusCode: logObj.res?.statusCode,
        responseTime: logObj.responseTime,
      });

      logDoc.save().catch((err) => {
        console.error("Failed to save log to MongoDB:", err.message);
      });
    } catch (err) {
      // Fallback: log error to console
      console.error("Failed to process log:", err.message);
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
