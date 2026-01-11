// Client for logging-service communication
const axios = require("axios");
const config = require("../config");

const sendLogToService = async function (logData) {
  if (!config.LOGGING_SERVICE_URL) {
    return;
  }

  try {
    // TODO: elad - send the log to the logging service
    console.log("Log sent to logging service:", logData);

    await axios.post(`${config.LOGGING_SERVICE_URL}/logs`, logData, {
      timeout: config.LOGGING_SERVICE_TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to send log to logging service:", error.message);
  }
};

const createLog = function (logData) {
  sendLogToService({
    ...logData,
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  createLog,
};
