// Environment configuration module for users-service
// Loads configuration from .env file and provides fallback defaults
// All microservices use this pattern for consistent configuration management

require("dotenv").config();

/**
 * Environment configuration object
 * Aggregates all configuration needed for users-service operation
 * Includes database, service discovery URLs, and timeout settings
 */
const env = {
  // Application environment (development, staging, production)
  // Controls logging verbosity and error handling behavior
  NODE_ENV: process.env.NODE_ENV || "development",

  // Port on which users-service HTTP server listens
  // Default 3000 for local development, overridden in production
  PORT: process.env.PORT || 3000,

  // MongoDB connection URI for users database
  // Format: mongodb://[user:password@]host:port/database
  // Default points to local MongoDB instance
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/app",

  // Base URL for costs-service API calls
  // Used when users-service needs to fetch user costs from costs-service
  // Example: http://localhost:4000/api
  COSTS_SERVICE_URL:
    process.env.COSTS_SERVICE_URL || "http://localhost:4000/api",

  // Timeout in milliseconds for costs-service HTTP requests
  // Prevents hanging requests if costs-service is slow or unresponsive
  // Default 3000ms = 3 seconds
  COSTS_SERVICE_TIMEOUT: process.env.COSTS_SERVICE_TIMEOUT || 3000,

  // Base URL for logging-service API calls
  // Used to send application logs to centralized logging service
  // Example: http://localhost:5000/api
  LOGGING_SERVICE_URL:
    process.env.LOGGING_SERVICE_URL || "http://localhost:5000/api",

  // Timeout in milliseconds for logging-service HTTP requests
  // Prevents request timeouts when sending logs
  // Default 3000ms = 3 seconds
  LOGGING_SERVICE_TIMEOUT: process.env.LOGGING_SERVICE_TIMEOUT || 3000,
};

// Export configuration object for use throughout users-service
module.exports = env;
