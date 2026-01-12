// Costs service - business logic layer
// Handles cost validation, processing, and monthly report generation with user verification
const costsRepository = require("../repositories/costs_repository");
const usersClient = require("../../clients/users_client");
const { logger } = require("../../logging");
const { ValidationError } = require("../../errors/validation_error");
const { NotFoundError } = require("../../errors/not_found_error");
const { ServiceError } = require("../../errors/service_error");
const Cost = require("../../db/models/cost.model");

/**
 * Validates cost data against schema and verifies user exists
 * Checks Cost model constraints and communicates with users service
 * @param {Object} data - Cost data object with userid, category, sum, description
 * @returns {Promise<Object>} Validated cost object if all checks pass
 * @throws {ValidationError} If cost data fails schema validation or user doesn't exist
 * @throws {ServiceError} If users service is unavailable or returns error
 */
const validateCostData = async function (data) {
  // Create temporary cost to validate against Mongoose schema
  const tempCost = new Cost(data);
  const validationError = tempCost.validateSync();

  // If schema validation fails, extract and throw the first error
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
    // Re-throw validation errors as-is
    if (error instanceof ValidationError) {
      throw error;
    }
    // Handle service communication errors (connection refused, timeout, 5xx errors)
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
      // Handle HTTP error responses from users service
      logger.error(
        { userId: data.userid, error: error.message },
        "Users service error"
      );
      throw new ServiceError(
        `Users service error: ${error.response.statusText}`,
        502
      );
    } else {
      // Handle unexpected errors during user verification
      logger.error(
        { userId: data.userid, error: error.message },
        "Failed to verify user existence"
      );
      throw new ServiceError("Failed to verify user existence", 502);
    }
  }

  return tempCost;
};

/**
 * Validates and normalizes parameters for monthly report endpoint
 * Ensures id, year, and month are valid numbers within acceptable ranges
 * @param {Object} params - Request parameters with id, year, month fields
 * @returns {Object} Validated and normalized object with userid, year, month as numbers
 * @throws {ValidationError} If parameters are missing or invalid
 */
const validateMonthlyReportParams = function (params) {
  const { id, year, month } = params;

  // Validate user ID parameter
  if (id === undefined || id === null) {
    throw new ValidationError("Field 'id' is required and must be a number");
  }

  const userIdNum = Number(id);
  if (isNaN(userIdNum)) {
    throw new ValidationError("Field 'id' is required and must be a number");
  }

  // Validate year parameter (reasonable range: 1900-2100)
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

  // Validate month parameter (must be 1-12)
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

/**
 * Validates and normalizes parameters for user total costs endpoint
 * Ensures userId is a valid number
 * @param {Object} params - Request parameters with userId field
 * @returns {number} Validated userId as a number
 * @throws {ValidationError} If userId is missing or not a valid number
 */
const validateUserTotalCostsParams = function (params) {
  const { userId } = params;

  // Validate userId parameter presence and type
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

/**
 * Creates a new cost entry with validation and returns formatted response
 * Validates cost data and user existence before persisting to database
 * @param {Object} costData - Cost object with userid, category, sum, description
 * @returns {Promise<Object>} Formatted cost response with _id, description, category, userid, sum, createdAt
 * @throws {ValidationError} If cost data is invalid or user doesn't exist
 * @throws {ServiceError} If users service fails or database operation fails
 */
const createCost = async function (costData) {
  // Validate cost data against schema and verify user exists
  const validatedCost = await validateCostData(costData);

  // Persist cost to database with validated data
  const cost = await costsRepository.createCost({
    description: validatedCost.description,
    category: validatedCost.category,
    userid: validatedCost.userid,
    sum: validatedCost.sum,
  });

  // Return formatted response with all relevant fields
  return {
    _id: cost._id,
    description: cost.description,
    category: cost.category,
    userid: cost.userid,
    sum: cost.sum,
    createdAt: cost.createdAt,
  };
};

/**
 * Generates monthly cost report with caching for past months
 * Returns empty report for future dates, fresh data for current month, cached data for past months
 * @param {Object} params - Request parameters with id, year, month
 * @returns {Promise<Object>} Object with userid, year, month, and costs array by category
 * @throws {NotFoundError} If user doesn't exist
 * @throws {ValidationError} If parameters are invalid
 * @throws {ServiceError} If users service fails
 */
const getMonthlyReport = async function (params) {
  // Validate and normalize all parameters
  const { userid: id, year, month } = validateMonthlyReportParams(params);
  const userid = id;

  // Validate that the user exists in the system
  try {
    const userExists = await usersClient.checkUserExists(userid);
    if (!userExists) {
      throw new NotFoundError(`User with id ${userid} not found`);
    }
  } catch (error) {
    // Re-throw not found errors as-is
    if (error instanceof NotFoundError) {
      throw error;
    }
    // Handle service communication errors (connection refused, timeout, 5xx)
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
      // Handle HTTP error responses from users service
      logger.error(
        { userId: userid, error: error.message },
        "Users service error"
      );
      throw new ServiceError(
        `Users service error: ${error.response.statusText}`,
        502
      );
    } else {
      // Handle unexpected errors during user verification
      logger.error(
        { userId: userid, error: error.message },
        "Failed to verify user existence"
      );
      throw new ServiceError("Failed to verify user existence", 502);
    }
  }

  // Get current date to determine which caching strategy to use
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth returns 0-11, we need 1-12

  // Check if the requested date is current month
  const isCurrentMonth = year === currentYear && month === currentMonth;

  // Check if the requested date is in the future
  const isInFuture =
    year > currentYear || (year === currentYear && month > currentMonth);

  // Check if the requested date is in the past
  const isInPast =
    year < currentYear || (year === currentYear && month < currentMonth);

  // If future date, return empty cost structure (no data to report)
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

  // If current month, always do fresh aggregation (data may change today)
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

  // If past date, check cache first for performance optimization
  if (isInPast) {
    const cachedReport = await costsRepository.getMonthlyReportFromCache(
      userid,
      year,
      month
    );

    // Return cached data if available
    if (cachedReport) {
      return {
        userid,
        year,
        month,
        costs: cachedReport.costs,
      };
    }

    // Get fresh data via aggregation if not in cache
    const report = await costsRepository.getCostsByMonthAggregation(
      userid,
      year,
      month
    );

    // Cache the report for future requests to improve performance
    await costsRepository.cacheMonthlyReport(userid, year, month, report);

    return {
      userid,
      year,
      month,
      costs: report,
    };
  }
};

/**
 * Calculates total costs for a specific user across all months
 * Uses efficient aggregation to sum all costs for a single user
 * @param {Object} params - Request parameters with userId field
 * @returns {Promise<Object>} Object with userid and total_costs fields
 * @throws {ValidationError} If userId parameter is invalid
 */
const getUserTotalCosts = async function (params) {
  // Validate and normalize userId parameter
  const userid = validateUserTotalCostsParams(params);

  // Calculate total from repository using aggregation pipeline
  const total = await costsRepository.getCostsTotalByUserId(userid);

  // Return formatted response with total costs
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
