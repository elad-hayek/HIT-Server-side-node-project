// Costs controller - request/response handling
const {
  createCost: createCostService,
  getMonthlyReport: getMonthlyReportService,
  getTotalCosts: getTotalCostsService,
} = require("../services/costs_service");

async function addCost(req, res, next) {
  try {
    const requestId = req.id || req.headers["x-request-id"];
    const cost = await createCostService(req.body, requestId);
    res.status(201).json(cost);
  } catch (err) {
    next(err);
  }
}

async function getMonthlyReport(req, res, next) {
  try {
    const requestId = req.id || req.headers["x-request-id"];
    const report = await getMonthlyReportService(req.query, requestId);
    res.status(200).json(report);
  } catch (err) {
    next(err);
  }
}

async function getTotalCosts(req, res, next) {
  try {
    const requestId = req.id || req.headers["x-request-id"];
    const totalCosts = await getTotalCostsService(req.query, requestId);
    res.status(200).json(totalCosts);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  addCost,
  getMonthlyReport,
  getTotalCosts,
};
