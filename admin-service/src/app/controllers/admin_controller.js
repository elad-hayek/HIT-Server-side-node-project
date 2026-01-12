const adminService = require("../services/admin_service");

/**
 * GET /api/about
 * Returns information about the development team
 * Response includes only first_name and last_name for each team member
 */
const getAbout = function (req, res, next) {
  try {
    const teamMembers = adminService.getTeamMembers();
    res.status(200).json(teamMembers);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAbout,
};
