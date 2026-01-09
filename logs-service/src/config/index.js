require("dotenv").config();

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/app",
  LOGGING_SERVICE_TIMEOUT: process.env.LOGGING_SERVICE_TIMEOUT || 3000,
};

module.exports = env;
