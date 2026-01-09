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

  return await Cost.aggregate([
    {
      $match: {
        userid: Number(userid),
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$sum" },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        total: 1,
      },
    },
  ]);
};

const cacheMonthlyReport = async function (userid, year, month, data) {
  return await MonthlyReport.create({
    userid: Number(userid),
    year: Number(year),
    month: Number(month),
    data,
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
