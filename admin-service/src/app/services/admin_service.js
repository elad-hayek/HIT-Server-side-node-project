const config = require('../../config');
const { logger } = require('../../logging');

/**
 * Get team members information
 * Returns array of developers with first_name and last_name only
 * Data is loaded from environment variables, not from database
 */
function getTeamMembers() { // TODO make async
  try {
    logger.info('Fetching team members information');

    // Get team members from config (loaded from .env)
    const teamMembers = config.teamMembers;

    if (!teamMembers || teamMembers.length === 0) {
      logger.warn('No team members configured in environment');
      return [];
    }

    // Return only first_name and last_name as required
    const result = teamMembers.map(member => ({
      first_name: member.first_name,
      last_name: member.last_name
    }));

    logger.info(`Returning ${result.length} team members`);
    return result;
  } catch (error) {
    logger.error({ error: error.message }, 'Error fetching team members');
    throw error;
  }
}

module.exports = {
  getTeamMembers
};