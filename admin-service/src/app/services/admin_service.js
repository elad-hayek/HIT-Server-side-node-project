// Admin service module - contains business logic for admin operations

/**
 * Retrieves all team members information
 * Returns a hardcoded array of team members with their names
 * @returns {Array<Object>} Array of team member objects with first_name and last_name properties
 */
const getTeamMembers = function () {
  // Initialize array of hardcoded team members
  const teamMembers = [
    {
      first_name: "Elad",
      last_name: "Hayek",
    },
    // Team member 2 - Ofir Zohar
    {
      first_name: "Ofir",
      last_name: "Zohar",
    },
    // Team member 3 - Zohar Abramoviz
    {
      first_name: "Zohar",
      last_name: "Abramoviz",
    },
  ];

  // Return the complete team members array to caller
  return teamMembers;
};

// Export service functions for use in controllers
module.exports = {
  getTeamMembers,
};
