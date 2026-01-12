// Costs controller module - handles HTTP requests for cost management endpoints

// Import costs service for business logic access
const costsService = require("../services/costs_service");

/**
 * Creates a new cost entry in the database
 * Handles POST /api/add requests with cost data
 * @param {Object} req - Express request object with cost data in body
 * @param {Object} res - Express response object for sending response
 * @param {Function} next - Express next middleware function for error handling
 * @returns {void} Sends 201 created status with cost data or error to next
 */
const addCost = async function (req, res, next) {
  try {
    // Validate and create cost through service layer
    const cost = await costsService.createCost(req.body);
    // Return 201 Created status with the newly created cost object
    res.status(201).json(cost);
  } catch (err) {
    // Pass validation or service errors to error middleware
    next(err);
  }
};

/**
 * Retrieves monthly cost summary report for a user
 * Handles GET /api/report requests with query parameters
 * @param {Object} req - Express request object with query params (id, year, month)
 * @param {Object} res - Express response object for sending response
 * @param {Function} next - Express next middleware function for error handling
 * @returns {void} Sends 200 OK with report data or error to next
 */
const getMonthlyReport = async function (req, res, next) {
  try {
    // Fetch monthly cost report from service layer
    const report = await costsService.getMonthlyReport(req.query);
    // Return 200 OK status with monthly report data
    res.status(200).json(report);
  } catch (err) {
    // Pass validation or service errors to error middleware
    next(err);
  }
};

/**
 * Calculates total costs for a specific user
 * Handles GET /api/user-total requests
 * @param {Object} req - Express request object with userId query param
 * @param {Object} res - Express response object for sending response
 * @param {Function} next - Express next middleware function for error handling
 * @returns {void} Sends 200 OK with total costs or error to next
 */
const getUserTotalCosts = async function (req, res, next) {
  try {
    // Calculate user's total costs from service layer
    const totalCosts = await costsService.getUserTotalCosts(req.query);
    // Return 200 OK status with total costs data
    res.status(200).json(totalCosts);
  } catch (err) {
    // Pass validation or service errors to error middleware
    next(err);
  }
};

// Export controller functions for route handlers
module.exports = {
  addCost,
  getMonthlyReport,
  getUserTotalCosts,
};
