// Logs controller module - handles HTTP requests for log retrieval and storage

// Import logs service for business logic access
const logsService = require("../services/log_service");

/**
 * Retrieves all stored logs from the database
 * Handles GET /api/logs requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object for sending response
 * @param {Function} next - Express next middleware function for error handling
 * @returns {void} Sends 200 OK with logs array or error to next middleware
 */
const getLogs = async function (req, res, next) {
  try {
    // Fetch all logs from database through service
    const logs = await logsService.getAllLogs();
    // Return 200 OK status with logs array
    res.status(200).json(logs);
  } catch (error) {
    // Pass any errors to error handling middleware
    next(error);
  }
};

/**
 * Creates a new log entry in the database
 * Handles POST /api/logs requests with log data
 * @param {Object} req - Express request object with log data in body
 * @param {Object} res - Express response object for sending response
 * @param {Function} next - Express next middleware function for error handling
 * @returns {void} Sends 201 Created with log data or error to next
 */
const createLog = async function (req, res, next) {
  try {
    // Create log entry through service layer
    const log = await logsService.createLog(req.body);
    // Return 201 Created status with the new log object
    res.status(201).json(log);
  } catch (error) {
    // Pass validation or service errors to error middleware
    next(error);
  }
};

// Export controller functions for route handlers
module.exports = {
  getLogs,
  createLog,
};
