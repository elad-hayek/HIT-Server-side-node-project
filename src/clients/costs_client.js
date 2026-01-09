// Client for costs-service communication
const axios = require("axios");
const config = require("../config");
const { logger } = require("../logging");

const getTotalCosts = async function (userId, requestId) {
  const baseUrl = config.COSTS_SERVICE_URL;
  const url = `${baseUrl}/internal/costs/total`;
  
  const headers = {};
  if (requestId) {
    headers["x-request-id"] = requestId;
  }

  try {
    // TODO: elad - remove this is for tests
    return 20;
    
    logger.info({ userId, requestId }, "Calling costs-service");
    
    const response = await axios.get(url, {
      params: { userId },
      headers,
      timeout: config.COSTS_SERVICE_TIMEOUT,
    });
    
    logger.info({ userId, requestId, total: response.data.total_costs }, "Costs-service response received");
    
    return response.data.total_costs;
  } catch (error) {
    logger.error({ userId, requestId, error: error.message }, "Costs-service call failed");
    throw error;
  }
};

module.exports = {
  getTotalCosts,
};
