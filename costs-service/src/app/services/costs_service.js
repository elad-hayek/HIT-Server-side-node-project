// Costs service - business logic layer
const costsRepository = require("../repositories/costs_repository");
const { ValidationError } = require("../../errors/validation_error");
const Cost = require("../../db/models/cost.model");

const validateCostData = function (data) {
  const tempCost = new Cost(data);
  const validationError = tempCost.validateSync();

  if (validationError) {
    const firstErrorKey = Object.keys(validationError.errors)[0];
    const firstError = validationError.errors[firstErrorKey];
    throw new ValidationError(firstError.message);
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

const createCost = async function (costData, requestId) {
  const validatedCost = validateCostData(costData);

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

const getMonthlyReport = async function (params, requestId) {
  const { userid, year, month } = validateMonthlyReportParams(params);

  // Check cache first
  const cachedReport = await costsRepository.getMonthlyReportFromCache(
    userid,
    year,
    month
  );

  if (cachedReport) {
    return cachedReport.data;
  }

  // Get fresh data via aggregation
  const report = await costsRepository.getCostsByMonthAggregation(
    userid,
    year,
    month
  );

  // Cache the report for future requests
  await costsRepository.cacheMonthlyReport(userid, year, month, report);

  return report;
};

const getUserTotalCosts = async function (params, requestId) {
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
