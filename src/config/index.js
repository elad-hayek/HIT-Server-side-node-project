require("dotenv").config();

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/app",
  COSTS_SERVICE_URL: process.env.COSTS_SERVICE_URL || "http://localhost:4000",
  COSTS_SERVICE_TIMEOUT: parseInt(process.env.COSTS_SERVICE_TIMEOUT || "3000", 10),
  LOGGING_SERVICE_URL: process.env.LOGGING_SERVICE_URL || null,
  LOGGING_SERVICE_TIMEOUT: parseInt(process.env.LOGGING_SERVICE_TIMEOUT || "2000", 10),
};

module.exports = env;
