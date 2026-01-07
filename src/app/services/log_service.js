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

module.exports = {
  getAllLogs,
};
