// Client for costs-service communication
// Provides HTTP client interface to retrieve user cost totals
const axios = require("axios");
const config = require("../config");
const { logger } = require("../logging");

/**
 * Retrieves total costs for a specific user from the costs-service
 * Queries the /user-total endpoint to get aggregated cost sum
 * @param {number} userId - The user ID to retrieve total costs for
 * @returns {Promise<number>} Total sum of all costs for the user
 * @throws {Error} If HTTP request fails (connection refused, timeout, error response)
 */
const getUserTotalCosts = async function (userId) {
  // Build URL to costs-service user-total endpoint
  const baseUrl = config.COSTS_SERVICE_URL;
  const url = `${baseUrl}/user-total`;

  try {
    // Make HTTP GET request with userId parameter and configured timeout
    const response = await axios.get(url, {
      params: { userId },
      timeout: config.COSTS_SERVICE_TIMEOUT,
    });

    // Extract and return total costs from response data
    return response.data.total_costs;
  } catch (error) {
    // Log error for debugging and re-throw for caller handling
    logger.error({ userId, error: error.message }, "Costs-service call failed");
    throw error;
  }
};

module.exports = {
  getUserTotalCosts,
};
