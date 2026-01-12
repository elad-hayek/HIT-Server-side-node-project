// Express application factory module - creates and configures costs service app

// Import Express framework for application creation
const express = require("express");
// Import HTTP request logging middleware
const loggerMiddleware = require("./middlewares/logger_middleware");
// Import error handling middleware for response
const errorMiddleware = require("./middlewares/error_middleware");
// Import all API routes configuration
const routes = require("./routes");

/**
 * Factory function that creates and configures Express application
 * Sets up middleware stack and mounts API routes
 * @returns {Object} Configured Express application instance
 */
const createApp = function () {
  // Create new Express application instance
  const app = express();
  // Apply request logging middleware at the beginning
  app.use(loggerMiddleware);
  // Parse incoming JSON request bodies
  app.use(express.json());
  // Mount API routes under /api path
  app.use("/api", routes);
  // Apply error handling middleware at the end
  app.use(errorMiddleware);

  // Return fully configured application
  return app;
};

// Export app factory function for server startup
module.exports = createApp;
