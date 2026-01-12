// Cost model module - Mongoose schema and model for cost entries
// Defines structure for storing individual cost records with validation rules

// Import MongoDB/Mongoose for schema definition and model creation
const mongoose = require("mongoose");
// Import valid cost categories configuration
const { VALID_CATEGORIES } = require("../../config/cost_categories");

// Define Mongoose schema for cost documents with validation rules
const costSchema = new mongoose.Schema(
  {
    // Description of the cost entry - required, trimmed string, cannot be empty
    description: {
      type: String,
      required: [true, "Field 'description' is required and must be a string"],
      trim: true,
      minlength: [1, "Field 'description' must not be empty"],
    },
    // Category of the cost - must be one of predefined valid categories (food, education, health, housing, sports)
    category: {
      type: String,
      required: [true, "Field 'category' is required and must be a string"],
      trim: true,
      enum: {
        values: VALID_CATEGORIES,
        message: `Field 'category' must be one of: ${VALID_CATEGORIES.join(
          ", "
        )}`,
      },
    },
    // User ID - links cost to a specific user, required numeric identifier
    userid: {
      type: Number,
      required: [true, "Field 'userid' is required and must be a number"],
    },
    // Cost amount - required positive number representing the cost value
    sum: {
      type: Number,
      required: [true, "Field 'sum' is required and must be a number"],
      validate: {
        validator: function (value) {
          return value > 0;
        },
        message: "Field 'sum' must be a positive number",
      },
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamp fields
    timestamps: true,
  }
);

// Create and export the Cost model for database operations
module.exports = mongoose.model("Cost", costSchema);
