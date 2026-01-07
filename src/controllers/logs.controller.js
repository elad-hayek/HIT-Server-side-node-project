// Logs controller - handles HTTP requests for logs endpoints

const logsService = require("../services/log.service");
const logger = require("../logging");

async function getLogs(req, res) {
  try {
    logger.info("GET /api/logs endpoint accessed");
    const logs = await logsService.getAllLogs();
    res.status(200).json(logs);

  } catch (error) {
    logger.error("Error in GET /api/logs:", error);
    res.status(500).json({

      id: "LOGS_FETCH_ERROR",
      message: "Failed to fetch logs",
    });
  }
}

module.exports = {
  getLogs,
};
// Export the getLogs function so routes can use it