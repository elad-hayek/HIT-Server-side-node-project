// Logs controller - handles HTTP requests for logs endpoints

const logsService = require("../services/log_service");

async function getLogs(req, res, next) {
  try {
    const logs = await logsService.getAllLogs();
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
}

async function createLog(req, res, next) {
  try {
    const log = await logsService.createLog(req.body);
    res.status(201).json(log);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getLogs,
  createLog,
};
