const {
  createCost,
  getMonthlyReport: getMonthlyReportService,
} = require("../services/costs.service");
const { AppError } = require("../../errors/app_error");

async function addCost(req, res, next) {
  try {
    const { description, category, userid, sum } = req.body;

    if (!description || !category || !userid || !sum) {
      throw new AppError("Missing required fields", 400);
    }

    const cost = await createCost({
      description,
      category,
      userid,
      sum,
    });

    res.status(201).json(cost);
  } catch (err) {
    next(err);
  }
}

async function getMonthlyReport(req, res, next) {
  try {
    const { userid, year, month } = req.query;

    if (!userid || !year || !month) {
      throw new AppError("Missing required query parameters", 400);
    }

    const report = await getMonthlyReportService({
      userid,
      year,
      month,
    });

    res.status(200).json(report);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  addCost,
  getMonthlyReport,
};
