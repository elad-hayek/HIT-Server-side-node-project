// Client for costs-service communication
const axios = require("axios");
const config = require("../config");
const { logger } = require("../logging");

const getUserTotalCosts = async function (userId) {
  const baseUrl = config.COSTS_SERVICE_URL;
  const url = `${baseUrl}/user-total`;

  try {
    const response = await axios.get(url, {
      params: { userId },
      timeout: config.COSTS_SERVICE_TIMEOUT,
    });

    return response.data.total_costs;
  } catch (error) {
    logger.error({ userId, error: error.message }, "Costs-service call failed");
    throw error;
  }
};

module.exports = {
  getUserTotalCosts,
};
