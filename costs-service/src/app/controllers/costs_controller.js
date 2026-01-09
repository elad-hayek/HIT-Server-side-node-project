// Costs controller - request/response handling
const costsService = require("../services/costs_service");

async function addCost(req, res, next) {
  try {
    const requestId = req.id || req.headers["x-request-id"];
    const cost = await costsService.createCost(req.body, requestId);
    res.status(201).json(cost);
  } catch (err) {
    next(err);
  }
}

async function getMonthlyReport(req, res, next) {
  try {
    const requestId = req.id || req.headers["x-request-id"];
    const report = await costsService.getMonthlyReport(req.query, requestId);
    res.status(200).json(report);
  } catch (err) {
    next(err);
  }
}

async function getUserTotalCosts(req, res, next) {
  try {
    const requestId = req.id || req.headers["x-request-id"];
    const totalCosts = await costsService.getUserTotalCosts(req.query, requestId);
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
