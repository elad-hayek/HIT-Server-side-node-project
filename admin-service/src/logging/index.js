// Logger configuration module - sets up Pino logging with custom streams

// Import Pino logging library for structured logging
const pino = require("pino");
// Import logging client for sending logs to external service
const loggingClient = require("../clients/logging_client");

// Map Pino numeric log levels to string representations for storage
const pinoLevelToString = {
  10: "debug", // trace level (Pino 10)
  20: "debug", // debug level (Pino 20)
  30: "info", // info level (Pino 30)
  40: "warn", // warn level (Pino 40)
  50: "error", // error level (Pino 50)
  60: "error", // fatal level (Pino 60)
};

/**
 * Custom stream object for writing logs to external service
 * Implements write(msg) interface for Pino streams
 */
const customStream = {
  /**
   * Writes log message to logging service via HTTP
   * Parses Pino JSON output and sends to service
   * @param {string} msg - JSON formatted log message from Pino
   * @returns {void}
   */
  write: (msg) => {
    try {
      // Parse Pino log message JSON string to object
      const logObj = JSON.parse(msg);
      // Convert numeric Pino level to string level
      const level = pinoLevelToString[logObj.level] || "info";

      // Send structured log to logging service endpoint
      loggingClient.createLog({
        // Log severity level (info, warn, error, debug)
        level,
        // Log message text content
        message: logObj.msg,
        // Log timestamp in Date format
        timestamp: new Date(logObj.time),
        // HTTP method from request (if available)
        method: logObj.req?.method,
        // URL path from request (if available)
        url: logObj.req?.url,
        // HTTP response status code (if available)
        statusCode: logObj.res?.statusCode,
        // Request processing time in milliseconds
        responseTime: logObj.responseTime,
      });
    } catch (err) {
      // Fallback error logging if processing fails
      console.error("Failed to send log:", err.message);
    }
  },
};

// Create Pino logger with console and custom stream outputs
const logger = pino(
  // Configure base logger with info level
  { level: "info" },
  // Use multiple output streams simultaneously
  pino.multistream([
    // Stream 1: Output to standard output (console)
    { level: "info", stream: process.stdout },
    // Stream 2: Output to custom logging service client
    { level: "info", stream: customStream },
  ])
);

// Export logger instance for use throughout application
module.exports = { logger };
