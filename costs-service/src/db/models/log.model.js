// Log model for storing application logs
const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    method: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
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
