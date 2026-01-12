/**
 * Get team members information
 * Returns array of developers with first_name and last_name
 * Hardcoded team members
 */
const getTeamMembers = function () {
  const teamMembers = [
    {
      first_name: "Elad",
      last_name: "Hayek",
    },
    {
      first_name: "Ofir",
      last_name: "Zohar",
    },
    {
      first_name: "Zohar",
      last_name: "Talab",
    },
  ];

  return teamMembers;
};

module.exports = {
  getTeamMembers,
};
