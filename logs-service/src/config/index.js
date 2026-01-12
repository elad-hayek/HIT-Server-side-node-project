// Environment configuration module for logs-service
// Loads configuration from .env file and provides fallback defaults
// All microservices use this pattern for consistent configuration management

require("dotenv").config();

/**
 * Environment configuration object
 * Aggregates all configuration needed for logs-service operation
 * Logs-service is a centralized logging microservice with minimal external dependencies
 */
const env = {
  // Application environment (development, staging, production)
  // Controls logging verbosity and error handling behavior
  NODE_ENV: process.env.NODE_ENV || "development",

  // Port on which logs-service HTTP server listens
  // Default 5000 for local development, overridden in production
  PORT: process.env.PORT || 5000,

  // MongoDB connection URI for logs database
  // Format: mongodb://[user:password@]host:port/database
  // Default points to local MongoDB instance
  // Stores all application logs from other microservices
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/app",

  // Timeout in milliseconds for internal operations
  // Used when logs-service performs any HTTP or async operations
  // Prevents hanging operations and ensures responsive error handling
  // Default 3000ms = 3 seconds
  LOGGING_SERVICE_TIMEOUT: process.env.LOGGING_SERVICE_TIMEOUT || 3000,
};

// Export configuration object for use throughout logs-service
module.exports = env;
