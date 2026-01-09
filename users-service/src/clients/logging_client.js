// Client for logging-service communication
const axios = require("axios");
const config = require("../config");

const logQueue = [];
let isSending = false;

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

const processQueue = async function () {
  if (isSending || logQueue.length === 0) {
    return;
  }

  isSending = true;

  const batch = logQueue.splice(0, Math.min(logQueue.length, 10));

  try {
    if (batch.length === 1) {
      await sendLogToService(batch[0]);
    } else {
      await sendLogToService({ logs: batch });
    }
  } catch (error) {
    console.error("Failed to process log queue:", error.message);
  }

  isSending = false;

  if (logQueue.length > 0) {
    setTimeout(processQueue, 100);
  }
};

const queueLog = function (logData) {
  logQueue.push({
    ...logData,
    timestamp: new Date().toISOString(),
  });

  if (!isSending) {
    setTimeout(processQueue, 500);
  }
};

const createLog = function (logData) {
  sendLogToService({
    ...logData,
    timestamp: new Date().toISOString(),
  });

  //TODO: elad - use the queue instead
  // queueLog(logData);
};

module.exports = {
  createLog,
};
