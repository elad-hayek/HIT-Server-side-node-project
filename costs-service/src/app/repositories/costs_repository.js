// Costs repository - database access layer for cost management
// Handles all database operations for costs and monthly reports
const Cost = require("../../db/models/cost.model");
const MonthlyReport = require("../../db/models/monthlyReport.model");

/**
 * Creates a new cost entry in the database
 * @param {Object} costData - Cost object containing sum, category, description, userid, createdAt
 * @returns {Promise<Object>} The saved cost document with _id and timestamps
 */
const createCost = async function (costData) {
  const cost = new Cost(costData);
  return await cost.save();
};

/**
 * Retrieves all costs associated with a specific user
 * @param {number} userid - The user ID to filter costs by
 * @returns {Promise<Array>} Array of cost documents for the user
 */
const findCostsByUserId = async function (userid) {
  return await Cost.find({ userid });
};

/**
 * Calculates total sum of all costs for a specific user
 * Uses MongoDB aggregation pipeline for efficient calculation
 * @param {number} userid - The user ID to calculate totals for
 * @returns {Promise<number>} Total sum of all user costs, returns 0 if no costs exist
 */
const getCostsTotalByUserId = async function (userid) {
  // Aggregate pipeline: match user costs and group to sum them
  const result = await Cost.aggregate([
    {
      $match: {
        userid: Number(userid),
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$sum" },
      },
    },
  ]);

  // Return total or 0 if no results found
  return result.length > 0 ? result[0].total : 0;
};

/**
 * Retrieves cached monthly report for a user from the database
 * @param {number} userid - The user ID
 * @param {number} year - The report year (e.g., 2024)
 * @param {number} month - The report month (1-12)
 * @returns {Promise<Object|null>} Monthly report document or null if not found
 */
const getMonthlyReportFromCache = async function (userid, year, month) {
  return await MonthlyReport.findOne({
    userid: Number(userid),
    year: Number(year),
    month: Number(month),
  });
};

/**
 * Fetches and aggregates costs by category for a specific month
 * Groups costs by category and extracts day information from timestamps
 * @param {number} userid - The user ID to get costs for
 * @param {number} year - The year to filter by
 * @param {number} month - The month to filter by (1-12)
 * @returns {Promise<Array>} Array containing single object with category arrays
 */
const getCostsByMonthAggregation = async function (userid, year, month) {
  // Create date range boundaries for the specified month
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  // Query costs within the date range for the user
  const costs = await Cost.find({
    userid: Number(userid),
    createdAt: {
      $gte: startDate,
      $lt: endDate,
    },
  }).lean();

  // Initialize the costs structure with all categories
  const costsByCategory = {
    food: [],
    education: [],
    health: [],
    housing: [],
    sports: [],
  };

  // Group costs by category and extract day from createdAt
  costs.forEach((cost) => {
    const day = new Date(cost.createdAt).getDate();
    const costItem = {
      sum: cost.sum,
      description: cost.description,
      day,
    };
    costsByCategory[cost.category].push(costItem);
  });

  // Return in the expected format: array of objects with category keys
  return [
    {
      food: costsByCategory.food,
      education: costsByCategory.education,
      health: costsByCategory.health,
      housing: costsByCategory.housing,
      sports: costsByCategory.sports,
    },
  ];
};

/**
 * Caches a monthly cost report in the database
 * Stores pre-calculated monthly report data for quick retrieval
 * @param {number} userid - The user ID to cache report for
 * @param {number} year - The year of the report
 * @param {number} month - The month of the report (1-12)
 * @param {Object} data - The pre-calculated cost data by category
 * @returns {Promise<Object>} The created monthly report document
 */
const cacheMonthlyReport = async function (userid, year, month, data) {
  return await MonthlyReport.create({
    userid: Number(userid),
    year: Number(year),
    month: Number(month),
    costs: data,
  });
};

module.exports = {
  createCost,
  findCostsByUserId,
  getCostsTotalByUserId,
  getMonthlyReportFromCache,
  getCostsByMonthAggregation,
  cacheMonthlyReport,
};
