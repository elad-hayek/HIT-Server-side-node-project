// Database models aggregation module - exports all Mongoose models for logs service
// Provides centralized access to Log model used throughout the application

// Import Log model for log document schema and validation
const Log = require("./log.model");

// Export all models as named exports for easy access in repositories and services
module.exports = {
  Log,
};
