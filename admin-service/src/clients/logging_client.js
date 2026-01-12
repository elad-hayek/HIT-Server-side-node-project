// Logging service client module - handles communication with external logging service

// Import HTTP client for making requests to logging service
const axios = require("axios");
// Import configuration with logging service URL and timeout settings
const config = require("../config");

/**
 * Sends log data to external logging service via HTTP POST
 * Handles network errors gracefully without throwing
 * @param {Object} logData - Log object with level, message, timestamp, etc.
 * @returns {Promise<void>} Resolves after sending or silently fails
 */
const sendLogToService = async function (logData) {
  // Check if logging service URL is configured
  if (!config.LOGGING_SERVICE_URL) {
    // Exit early if service is not configured
    return;
  }

  try {
    // Send POST request to logging service endpoint
    await axios.post(`${config.LOGGING_SERVICE_URL}/logs`, logData, {
      // Set request timeout to prevent hanging
      timeout: config.LOGGING_SERVICE_TIMEOUT,
      // Specify JSON content type for the request
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // Log error to console if service communication fails
    console.error("Failed to send log to logging service:", error.message);
  }
};

/**
 * Creates and sends a log entry to the logging service
 * Wraps log data and sends asynchronously
 * @param {Object} logData - Log object with level, message, and optional metadata
 * @returns {void} Sends log asynchronously without waiting
 */
const createLog = function (logData) {
  // Invoke async send function without awaiting to avoid blocking
  sendLogToService({
    // Spread existing log data
    ...logData,
    // Add current timestamp in ISO format
    timestamp: new Date().toISOString(),
  });
};

// Export logging client functions for use throughout application
module.exports = {
  createLog,
};
