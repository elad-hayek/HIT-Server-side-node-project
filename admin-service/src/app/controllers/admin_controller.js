// Admin controller module - handles HTTP requests for admin endpoints
const adminService = require("../services/admin_service");

/**
 * Retrieves team members information endpoint
 * Handles GET /api/about requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object containing JSON response
 * @param {Function} next - Express next middleware function for error handling
 * @returns {void} Sends JSON response with team members (200) or error to next middleware
 */
const getAbout = function (req, res, next) {
  try {
    // Fetch hardcoded team members from service layer
    const teamMembers = adminService.getTeamMembers();
    // Return 200 success status with team members data
    res.status(200).json(teamMembers);
  } catch (error) {
    // Pass any errors to error handling middleware
    next(error);
  }
};

// Export controller functions for routing use
module.exports = {
  getAbout,
};
