// Server entry point for logs service - initializes database and starts application

// Load Express application factory with routes
const createApp = require("./src/app/app");
// Import MongoDB connection initialization function
const { connectDB } = require("./src/db");
// Import logger for logging server events
const { logger } = require("./src/logging");
// Load configuration with port and service URLs
const config = require("./src/config");

// Create Express application with middleware
const app = createApp();

// Connect to MongoDB before accepting requests
connectDB().then(() => {
  // Get port from config or use default 5000
  const port = config.PORT || 5000;
  // Start listening for HTTP requests
  app.listen(port, () => {
    // Log successful server startup
    logger.info(`Server running on port ${port}`);
  });
});
