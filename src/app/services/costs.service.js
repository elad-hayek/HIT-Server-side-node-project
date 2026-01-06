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
  // implementation will be added later
  return null;
}

module.exports = {
  createCost,
  getMonthlyReport,
};
