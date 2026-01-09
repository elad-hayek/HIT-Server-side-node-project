// Client for costs-service communication
const axios = require("axios");
const config = require("../config");
const { logger } = require("../logging");

const getUserTotalCosts = async function (userId, requestId) {
  const baseUrl = config.COSTS_SERVICE_URL;
  const url = `${baseUrl}/user-total`;

  const headers = {};
  if (requestId) {
    headers["x-request-id"] = requestId;
  }

  try {

    const response = await axios.get(url, {
      params: { userId },
      headers,
      timeout: config.COSTS_SERVICE_TIMEOUT,
    });

    return response.data.total_costs;
  } catch (error) {
    logger.error(
      { userId, requestId, error: error.message },
      "Costs-service call failed"
    );
    throw error;
  }
};

module.exports = {
  getUserTotalCosts,
};
