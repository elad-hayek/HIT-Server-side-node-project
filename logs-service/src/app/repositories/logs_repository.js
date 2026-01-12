// Logs repository - database access layer for log management
// Handles all database operations for application logs
const Log = require("../../db/models/log.model");

/**
 * Creates a new log entry in the database
 * Stores log information including timestamp, level, and message
 * @param {Object} logData - Log object containing timestamp, level, message, service, user, details
 * @returns {Promise<Object>} The saved log document with _id and timestamps
 */
const createLog = async function (logData) {
  const log = new Log(logData);
  return await log.save();
};

/**
 * Retrieves all logs from the database sorted by newest first
 * @returns {Promise<Array>} Array of all log documents sorted by timestamp descending
 */
const findAllLogs = async function () {
  return await Log.find().sort({ timestamp: -1 });
};

/**
 * Retrieves a specific log by its database ID
 * @param {string} id - The MongoDB ObjectId of the log document
 * @returns {Promise<Object|null>} The log document or null if not found
 */
const findLogById = async function (id) {
  return await Log.findById(id);
};

module.exports = {
  createLog,
  findAllLogs,
  findLogById,
};
