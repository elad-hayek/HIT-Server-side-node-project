// Server entry point for costs service - initializes database and starts application

// Load Express application factory
const createApp = require("./src/app/app");
// Import database connection function for MongoDB initialization
const { connectDB } = require("./src/db");
// Import logger instance for logging server events
const { logger } = require("./src/logging");
// Load environment configuration and settings
const config = require("./src/config");

// Create Express application with middleware and routes
const app = createApp();

// Connect to MongoDB database before starting server
connectDB().then(() => {
  // Extract port from config or use default 4000
  const port = config.PORT || 4000;
  // Start HTTP server listening on configured port
  app.listen(port, () => {
    // Log confirmation of successful server startup
    logger.info(`Server running on port ${port}`);
  });
});
