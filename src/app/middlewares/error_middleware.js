// Error handling middleware
const { logger } = require("../../logging");

function errorHandler(err, req, res, next) {
  const requestId = req.id || req.headers["x-request-id"] || "unknown";
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  // Recreate the custom log data that logging middleware creates
  if (!req.customLogData) {
    req.customLogData = {
      method: req.method,
      url: req.url,
      responseTime: null,
    };
  }

  // Calculate response time if we have the start time
  if (req.startTime) {
    req.customLogData.responseTime = Date.now() - req.startTime;
  }

  // Set the error status code
  req.customLogData.statusCode = status;

  // Use the logger - attach customLogData to req object so customStream can find it
  logger.error({
    req: { customLogData: req.customLogData },
    msg: message,
    requestId: requestId,
  });

  res.status(status).json({
    id: requestId,
    message: message,
  });
}

module.exports = errorHandler;
