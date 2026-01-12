// Monthly Report model module - Mongoose schema for cached monthly cost summaries
// Stores aggregated cost data by category for each month to improve query performance

// Import MongoDB/Mongoose for schema definition and model creation
const mongoose = require("mongoose");

// Define Mongoose schema for monthly cost report documents
const monthlyReportSchema = new mongoose.Schema(
  {
    // User ID - identifies which user this report belongs to
    userid: {
      type: Number,
      required: true,
    },
    // Year of the report - part of unique identifier (userid, year, month)
    year: {
      type: Number,
      required: true,
    },
    // Month of the report (1-12) - part of unique identifier
    month: {
      type: Number,
      required: true,
    },
    // Array of cost summaries organized by category for the month
    costs: [
      {
        // Food category costs for the month
        food: [
          {
            sum: Number,
            description: String,
            day: Number,
          },
        ],
        // Education category costs for the month
        education: [
          {
            sum: Number,
            description: String,
            day: Number,
          },
        ],
        // Health category costs for the month
        health: [
          {
            sum: Number,
            description: String,
            day: Number,
          },
        ],
        // Housing category costs for the month
        housing: [
          {
            sum: Number,
            description: String,
            day: Number,
          },
        ],
        // Sports category costs for the month
        sports: [
          {
            sum: Number,
            description: String,
            day: Number,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Create compound unique index on userid, year, month to prevent duplicate reports for same period
monthlyReportSchema.index({ userid: 1, year: 1, month: 1 }, { unique: true });

// Create and export the MonthlyReport model for database operations
module.exports = mongoose.model("MonthlyReport", monthlyReportSchema);
