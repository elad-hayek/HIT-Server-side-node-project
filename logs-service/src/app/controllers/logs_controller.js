// Logs controller - handles HTTP requests for logs endpoints

const logsService = require("../services/log_service");

const getLogs = async function (req, res, next) {
  try {
    const logs = await logsService.getAllLogs();
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};

const createLog = async function (req, res, next) {
  try {
    const log = await logsService.createLog(req.body);
    res.status(201).json(log);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLogs,
  createLog,
};
