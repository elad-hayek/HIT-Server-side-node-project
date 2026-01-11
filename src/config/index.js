require("dotenv").config();

/**
 * Load team members from environment variables
 * Format: TEAM_MEMBER_N_FIRST_NAME and TEAM_MEMBER_N_LAST_NAME
 */
function loadTeamMembers() {
  const teamMembers = [];
  let index = 1;

  while (true) {
    const firstName = process.env[`TEAM_MEMBER_${index}_FIRST_NAME`];
    const lastName = process.env[`TEAM_MEMBER_${index}_LAST_NAME`];

    if (!firstName || !lastName) {
      break;
    }

    teamMembers.push({
      first_name: firstName,
      last_name: lastName
    });

    index++;
  }

  return teamMembers;
}

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/app",
  COSTS_SERVICE_URL: process.env.COSTS_SERVICE_URL || "http://localhost:4000",
  COSTS_SERVICE_TIMEOUT: parseInt(process.env.COSTS_SERVICE_TIMEOUT || "3000", 10),
  LOGGING_SERVICE_URL: process.env.LOGGING_SERVICE_URL || null,
  LOGGING_SERVICE_TIMEOUT: parseInt(process.env.LOGGING_SERVICE_TIMEOUT || "2000", 10),
  teamMembers: loadTeamMembers(),
};

module.exports = env;
