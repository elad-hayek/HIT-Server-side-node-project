// Express application factory module - creates and configures the Express app instance
const express = require("express");
const loggerMiddleware = require("./middlewares/logger_middleware");
const errorMiddleware = require("./middlewares/error_middleware");
const routes = require("./routes");

/**
 * Factory function that creates and configures Express application
 * Applies middleware stack and route handlers
 * @returns {Object} Configured Express application instance
 */
const createApp = function () {
  // Initialize Express application instance
  const app = express();
  // Apply HTTP request logging middleware first in the stack
  app.use(loggerMiddleware);
  // Parse incoming JSON request bodies to JavaScript objects
  app.use(express.json());
  // Mount API routes under /api path prefix
  app.use("/api", routes);
  // Apply error handling middleware at the end of the stack
  app.use(errorMiddleware);

  // Return configured application for server startup
  return app;
};

// Export app factory function for server initialization
module.exports = createApp;
