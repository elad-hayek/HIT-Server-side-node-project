const adminService = require("../services/admin_service");

/**
 * GET /api/about
 * Returns information about the development team
 * Response includes only first_name and last_name for each team member
 * Data is fetched from MongoDB database
 */
async function getAbout(req, res, next) {
  try {
   const requestId = req.id || req.headers["x-request-id"];
    const teamMembers = await adminService.getTeamMembers();
    res.status(200).json(teamMembers);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAbout,
};
