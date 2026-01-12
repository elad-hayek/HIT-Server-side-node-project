// Log model module - Mongoose schema for application logs
// Defines structure for storing centralized logs from all services

// Import MongoDB/Mongoose for schema definition and model creation
const mongoose = require("mongoose");

// Define Mongoose schema for log documents with validation rules
const logSchema = new mongoose.Schema(
  {
    // Log level - severity indicator: info, warn, error, or debug
    level: {
      type: String,
      required: [true, "Field 'level' is required and must be a string"],
      trim: true,
      enum: {
        values: ["info", "warn", "error", "debug"],
        message: "Field 'level' must be one of: info, warn, error, debug",
      },
    },
    // Log message - the actual log content describing what happened
    message: {
      type: String,
      required: [true, "Field 'message' is required and must be a string"],
      trim: true,
    },
    // Timestamp - when the log event occurred, defaults to current time
    timestamp: {
      type: Date,
      required: [true, "Field 'timestamp' is required"],
      default: Date.now,
      validate: {
        validator: function (value) {
          return value instanceof Date && !isNaN(value);
        },
        message: "Field 'timestamp' must be a valid date",
      },
    },
    // HTTP method - optional field for logging HTTP request method (GET, POST, etc.)
    method: {
      type: String,
      required: false,
      trim: true,
    },
    // URL path - optional field for logging the requested endpoint
    url: {
      type: String,
      required: false,
      trim: true,
    },
    // HTTP status code - optional field for logging response status (200, 404, 500, etc.)
    statusCode: {
      type: Number,
      required: false,
    },
    // Response time in milliseconds - optional field for performance logging
    responseTime: {
      type: Number,
      required: false,
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamp fields
    timestamps: true,
  }
);

// Create Log model from schema
const Log = mongoose.model("Log", logSchema);

// Export the Log model for database operations
module.exports = Log;
