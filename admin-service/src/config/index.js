// Environment configuration module - loads and exports application settings

// Load environment variables from .env file into process.env
require("dotenv").config();

// Export configuration object with environment-specific settings
const env = {
  // Application environment (development, production, test)
  NODE_ENV: process.env.NODE_ENV || "development",
  // Server port for HTTP listener
  PORT: process.env.PORT || 2000,
  // Log level for Pino logger (debug, info, warn, error)
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  // MongoDB connection URI for database access
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/app",
  // External logging service base URL for log submission
  LOGGING_SERVICE_URL:
    process.env.LOGGING_SERVICE_URL || "http://localhost:5000/api",
  // Request timeout for logging service communication in milliseconds
  LOGGING_SERVICE_TIMEOUT: process.env.LOGGING_SERVICE_TIMEOUT || 3000,
};

// Export configuration for use throughout application
module.exports = env;
