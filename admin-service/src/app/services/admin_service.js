const projectMembersRepository = require("../repositories/project_members_repository");

/**
 * Get team members information
 * Returns array of developers with first_name and last_name only
 * Data is fetched from MongoDB database
 */
async function getTeamMembers() {
  try {
    const members = await projectMembersRepository.getAllProjectMembers();
    return members;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getTeamMembers,
};
