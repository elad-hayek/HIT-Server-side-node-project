// Costs service - business logic layer
const costsRepository = require("../repositories/costs_repository");
const usersClient = require("../../clients/users_client");
const { logger } = require("../../logging");
const { ValidationError } = require("../../errors/validation_error");
const { NotFoundError } = require("../../errors/not_found_error");
const { ServiceError } = require("../../errors/service_error");
const Cost = require("../../db/models/cost.model");

const validateCostData = async function (data) {
  const tempCost = new Cost(data);
  const validationError = tempCost.validateSync();

  if (validationError) {
    const firstErrorKey = Object.keys(validationError.errors)[0];
    const firstError = validationError.errors[firstErrorKey];
    throw new ValidationError(firstError.message);
  }

  // Check if the userid exists in the users service
  try {
    const userExists = await usersClient.checkUserExists(data.userid);
    if (!userExists) {
      throw new ValidationError(`User with id ${data.userid} does not exist`);
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    // Handle service communication errors
    if (
      error.code === "ECONNREFUSED" ||
      error.code === "ETIMEDOUT" ||
      error.response?.status >= 500
    ) {
      logger.error(
        { userId: data.userid, error: error.message },
        "Users service unavailable"
      );
      throw new ServiceError("Users service unavailable", 503);
    } else if (error.response) {
      logger.error(
        { userId: data.userid, error: error.message },
        "Users service error"
      );
      throw new ServiceError(
        `Users service error: ${error.response.statusText}`,
        502
      );
    } else {
      logger.error(
        { userId: data.userid, error: error.message },
        "Failed to verify user existence"
      );
      throw new ServiceError("Failed to verify user existence", 502);
    }
  }

  return tempCost;
};

const validateMonthlyReportParams = function (params) {
  const { userid, year, month } = params;

  if (userid === undefined || userid === null) {
    throw new ValidationError(
      "Field 'userid' is required and must be a number"
    );
  }

  const userIdNum = Number(userid);
  if (isNaN(userIdNum)) {
    throw new ValidationError(
      "Field 'userid' is required and must be a number"
    );
  }

  const yearNum = Number(year);
  if (
    year === undefined ||
    year === null ||
    isNaN(yearNum) ||
    yearNum < 1900 ||
    yearNum > 2100
  ) {
    throw new ValidationError(
      "Field 'year' is required and must be a valid year"
    );
  }

  const monthNum = Number(month);
  if (
    month === undefined ||
    month === null ||
    isNaN(monthNum) ||
    monthNum < 1 ||
    monthNum > 12
  ) {
    throw new ValidationError(
      "Field 'month' is required and must be between 1 and 12"
    );
  }

  return {
    userid: userIdNum,
    year: yearNum,
    month: monthNum,
  };
};

const validateUserTotalCostsParams = function (params) {
  const { userId } = params;

  if (userId === undefined || userId === null) {
    throw new ValidationError(
      "Field 'userId' is required and must be a number"
    );
  }

  const userIdNum = Number(userId);
  if (isNaN(userIdNum)) {
    throw new ValidationError(
      "Field 'userId' is required and must be a number"
    );
  }

  return userIdNum;
};

const createCost = async function (costData) {
  const validatedCost = await validateCostData(costData);

  const cost = await costsRepository.createCost({
    description: validatedCost.description,
    category: validatedCost.category,
    userid: validatedCost.userid,
    sum: validatedCost.sum,
  });

  return {
    _id: cost._id,
    description: cost.description,
    category: cost.category,
    userid: cost.userid,
    sum: cost.sum,
    createdAt: cost.createdAt,
  };
};

const getMonthlyReport = async function (params) {
  const { userid, year, month } = validateMonthlyReportParams(params);

  // Validate that the user exists
  try {
    const userExists = await usersClient.checkUserExists(userid);
    if (!userExists) {
      throw new NotFoundError(`User with id ${userid} not found`);
    }
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    // Handle service communication errors
    if (
      error.code === "ECONNREFUSED" ||
      error.code === "ETIMEDOUT" ||
      error.response?.status >= 500
    ) {
      logger.error(
        { userId: userid, error: error.message },
        "Users service unavailable"
      );
      throw new ServiceError("Users service unavailable", 503);
    } else if (error.response) {
      logger.error(
        { userId: userid, error: error.message },
        "Users service error"
      );
      throw new ServiceError(
        `Users service error: ${error.response.statusText}`,
        502
      );
    } else {
      logger.error(
        { userId: userid, error: error.message },
        "Failed to verify user existence"
      );
      throw new ServiceError("Failed to verify user existence", 502);
    }
  }

  // Get current date
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth returns 0-11, we need 1-12

  // Check if the requested date is current
  const isCurrentMonth = year === currentYear && month === currentMonth;

  // Check if the requested date is in the future
  const isInFuture =
    year > currentYear || (year === currentYear && month > currentMonth);

  // Check if the requested date is in the past
  const isInPast =
    year < currentYear || (year === currentYear && month < currentMonth);

  // If future date, return with empty costs
  if (isInFuture) {
    return {
      userid,
      year,
      month,
      costs: [
        {
          food: [],
          education: [],
          health: [],
          housing: [],
          sports: [],
        },
      ],
    };
  }

  // If current month, always do the aggregation (fresh data)
  if (isCurrentMonth) {
    const report = await costsRepository.getCostsByMonthAggregation(
      userid,
      year,
      month
    );
    return {
      userid,
      year,
      month,
      costs: report,
    };
  }

  // If past date, check cache first
  if (isInPast) {
    const cachedReport = await costsRepository.getMonthlyReportFromCache(
      userid,
      year,
      month
    );

    if (cachedReport) {
      return {
        userid,
        year,
        month,
        costs: cachedReport.costs,
      };
    }

    // Get fresh data via aggregation
    const report = await costsRepository.getCostsByMonthAggregation(
      userid,
      year,
      month
    );

    // Cache the report for future requests
    await costsRepository.cacheMonthlyReport(userid, year, month, report);

    return {
      userid,
      year,
      month,
      costs: report,
    };
  }
};

const getUserTotalCosts = async function (params) {
  const userid = validateUserTotalCostsParams(params);

  const total = await costsRepository.getCostsTotalByUserId(userid);

  return {
    userid,
    total_costs: total,
  };
};

module.exports = {
  createCost,
  getMonthlyReport,
  getUserTotalCosts,
};
