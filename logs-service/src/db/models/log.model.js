// Log model for storing application logs
const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      required: [true, "Field 'level' is required and must be a string"],
      trim: true,
      enum: {
        values: ["info", "warn", "error", "debug"],
        message: "Field 'level' must be one of: info, warn, error, debug",
      },
    },
    message: {
      type: String,
      required: [true, "Field 'message' is required and must be a string"],
      trim: true,
    },
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
    method: {
      type: String,
      required: false,
      trim: true,
    },
    url: {
      type: String,
      required: false,
      trim: true,
    },
    statusCode: {
      type: Number,
      required: false,
    },
    responseTime: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Log = mongoose.model("Log", logSchema);

module.exports = Log;
