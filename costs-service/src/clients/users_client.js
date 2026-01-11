// Client for users-service communication
const axios = require("axios");
const config = require("../config");
const { logger } = require("../logging");

const checkUserExists = async function (userId) {
  const baseUrl = config.USERS_SERVICE_URL;
  const url = `${baseUrl}/exists/${userId}`;

  try {
    const response = await axios.get(url, {
      timeout: config.USERS_SERVICE_TIMEOUT,
    });

    return response.data.exists;
  } catch (error) {
    logger.error({ userId, error: error.message }, "Users-service call failed");
    throw error;
  }
};

module.exports = {
  checkUserExists,
};
