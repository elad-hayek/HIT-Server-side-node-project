const Cost = require("../../db/models/cost.model");
const MonthlyReport = require("../../db/models/monthlyReport.model");

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
  // TODO: zohar - check if the user exists

  // 1️⃣ בדיקת Cache
  const cachedReport = await MonthlyReport.findOne({
    userid: Number(userid),
    year: Number(year),
    month: Number(month),
  });

  if (cachedReport) {
    return cachedReport.data;
  }

  // 2️⃣ חישוב הדוח (Aggregation)
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

  // 3️⃣ שמירת Cache
  await MonthlyReport.create({
    userid: Number(userid),
    year: Number(year),
    month: Number(month),
    data: report,
  });

  return report;
}

module.exports = {
  createCost,
  getMonthlyReport,
};
