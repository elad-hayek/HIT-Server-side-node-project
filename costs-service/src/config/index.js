// Configuration module - loads and exports all environment settings

// Load environment variables from .env file
require("dotenv").config();

// Export configuration object with all environment variables
const env = {
  // Application environment (development, production, test)
  NODE_ENV: process.env.NODE_ENV || "development",
  // HTTP server port for listening
  PORT: process.env.PORT || 4000,
  // MongoDB connection string for database
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/app",
  // External users service base URL for validation
  USERS_SERVICE_URL:
    process.env.USERS_SERVICE_URL || "http://localhost:3000/api",
  // Request timeout for users service in milliseconds
  USERS_SERVICE_TIMEOUT: process.env.USERS_SERVICE_TIMEOUT || 3000,
  // External logging service base URL for log submission
  LOGGING_SERVICE_URL:
    process.env.LOGGING_SERVICE_URL || "http://localhost:5000/api",
  // Request timeout for logging service in milliseconds
  LOGGING_SERVICE_TIMEOUT: process.env.LOGGING_SERVICE_TIMEOUT || 3000,
};

// Export configuration for use throughout application
module.exports = env;
