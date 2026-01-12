// Database models aggregation module - exports all Mongoose models for costs service
// Provides centralized access to Cost and MonthlyReport models used throughout the application

// Import Cost model for cost document schema and validation
const Cost = require("./cost.model");
// Import MonthlyReport model for cached monthly cost summaries
const MonthlyReport = require("./monthlyReport.model");
// Import Log model for application logging (for reference)
const Log = require("./log.model");

// Export all models as named exports for easy access in repositories and services
module.exports = {
  Cost,
  MonthlyReport,
  Log,
};
