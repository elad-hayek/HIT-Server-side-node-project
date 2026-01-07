// Export all models
const User = require("./user.model");
const Cost = require("./cost.model");
const Log = require("./log.model");
const MonthlyReport = require("./monthlyReport.model");

module.exports = {
  User,
  Cost,
  Log,
  MonthlyReport
};
