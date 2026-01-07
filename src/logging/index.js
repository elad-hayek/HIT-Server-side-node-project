// Pino logger configuration with MongoDB stream
const pino = require("pino");
const createMongoStream = require("./mongo-stream");

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
