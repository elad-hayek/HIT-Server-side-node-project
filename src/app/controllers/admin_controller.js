const adminService = require('../services/admin_service');
const { logger } = require('../../logging');

/**
 * GET /api/about
 * Returns information about the development team
 * Response includes only first_name and last_name for each team member
 */
async function getAbout(req, res, next) {
  try {
    const requestId = req.id;
    logger.info({ requestId }, 'GET /api/about - Fetching team information');

    const teamMembers = adminService.getTeamMembers();

    logger.info({ requestId, count: teamMembers.length }, 'Successfully retrieved team members');

    res.status(200).json(teamMembers);
  } catch (error) {
    logger.error({ requestId: req.id, error: error.message }, 'Error in getAbout controller');
    next(error);
  }
}

module.exports = {
  getAbout
};
