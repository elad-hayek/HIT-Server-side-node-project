// Express application factory module - creates users service app

// Import Express framework for app creation
const express = require("express");
// Import HTTP request logging middleware
const loggerMiddleware = require("./middlewares/logger_middleware");
// Import error handling middleware
const errorMiddleware = require("./middlewares/error_middleware");
// Import routes configuration
const routes = require("./routes");

/**
 * Factory function to create and configure Express application
 * Sets up all middleware and routes
 * @returns {Object} Configured Express app instance
 */
const createApp = function () {
  // Create Express app instance
  const app = express();
  // Apply request logging middleware
  app.use(loggerMiddleware);
  // Parse JSON request bodies
  app.use(express.json());
  // Mount API routes
  app.use("/api", routes);
  // Apply error handling middleware
  app.use(errorMiddleware);

  // Return configured app
  return app;
};

// Export app factory
module.exports = createApp;
