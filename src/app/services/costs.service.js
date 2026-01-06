const Cost = require("../../models/cost.model");

async function createCost({ description, category, userid, sum }) {
  const cost = await Cost.create({
    description,
    category,
    userid,
    sum,
  });

  return cost;
}

async function getMonthlyReport({ userid, year, month }) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const report = await Cost.aggregate([
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

  return report;
}

module.exports = {
  createCost,
  getMonthlyReport,
};
