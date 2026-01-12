// Client for users-service communication
// Provides HTTP client interface to verify user existence
const axios = require("axios");
const config = require("../config");
const { logger } = require("../logging");

/**
 * Checks if a user exists in the users-service via HTTP request
 * Queries the /exists endpoint to verify user presence before processing costs
 * @param {number} userId - The user ID to check for existence
 * @returns {Promise<boolean>} True if user exists, false otherwise
 * @throws {Error} If HTTP request fails (connection refused, timeout, error response)
 */
const checkUserExists = async function (userId) {
  // Build URL to users-service exists endpoint
  const baseUrl = config.USERS_SERVICE_URL;
  const url = `${baseUrl}/exists/${userId}`;

  try {
    // Make HTTP GET request with configured timeout
    const response = await axios.get(url, {
      timeout: config.USERS_SERVICE_TIMEOUT,
    });

    // Extract and return existence flag from response data
    return response.data.exists;
  } catch (error) {
    // Log error for debugging and re-throw for caller handling
    logger.error({ userId, error: error.message }, "Users-service call failed");
    throw error;
  }
};

module.exports = {
  checkUserExists,
};
