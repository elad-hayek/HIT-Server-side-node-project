// Logs service - business logic for logs operations
const Log = require("../../db/models/log.model");

// Get all logs from database
async function getAllLogs() {
  try {
    // Find all logs in the database
    // Sort by timestamp (newest first)
    const logs = await Log.find().sort({ timestamp: -1 });
    return logs;
  } catch (error) {
    // If there's an error, throw it so the controller can handle it
    throw new Error("Error fetching logs from database: " + error.message);
  }
}

// Create a new log entry
async function createLog(logData) {
  try {
    const log = new Log({
      level: logData.level || "info",
      message: logData.message || "",
      timestamp: logData.timestamp || new Date(),
      method: logData.method,
      url: logData.url,
      statusCode: logData.statusCode,
      responseTime: logData.responseTime,
    });

    const savedLog = await log.save();
    return savedLog;
  } catch (error) {
    throw new Error("Error creating log: " + error.message);
  }
}

module.exports = {
  getAllLogs,
  createLog,
};
