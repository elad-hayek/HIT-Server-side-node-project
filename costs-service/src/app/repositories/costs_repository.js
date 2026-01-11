// Costs repository - database access layer
const Cost = require("../../db/models/cost.model");
const MonthlyReport = require("../../db/models/monthlyReport.model");

const createCost = async function (costData) {
  const cost = new Cost(costData);
  return await cost.save();
};

const findCostsByUserId = async function (userid) {
  return await Cost.find({ userid });
};

const getCostsTotalByUserId = async function (userid) {
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

  return result.length > 0 ? result[0].total : 0;
};

const getMonthlyReportFromCache = async function (userid, year, month) {
  return await MonthlyReport.findOne({
    userid: Number(userid),
    year: Number(year),
    month: Number(month),
  });
};

const getCostsByMonthAggregation = async function (userid, year, month) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

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
