// Costs controller - request/response handling
const costsService = require("../services/costs_service");

async function addCost(req, res, next) {
  try {
    const cost = await costsService.createCost(req.body);
    res.status(201).json(cost);
  } catch (err) {
    next(err);
  }
}

async function getMonthlyReport(req, res, next) {
  try {
    const report = await costsService.getMonthlyReport(req.query);
    res.status(200).json(report);
  } catch (err) {
    next(err);
  }
}

async function getUserTotalCosts(req, res, next) {
  try {
    const totalCosts = await costsService.getUserTotalCosts(req.query);
    res.status(200).json(totalCosts);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  addCost,
  getMonthlyReport,
  getUserTotalCosts,
};
