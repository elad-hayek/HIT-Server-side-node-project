// Server entry point for users service - initializes database and starts application

// Load Express application factory
const createApp = require("./src/app/app");
// Import database connection function
const { connectDB } = require("./src/db");
// Import logger for server events
const { logger } = require("./src/logging");
// Load environment configuration
const config = require("./src/config");

// Create Express application with middleware
const app = createApp();

// Connect to MongoDB before accepting requests
connectDB().then(() => {
  // Get port from config or use default 3000
  const port = config.PORT || 3000;
  // Start listening for HTTP requests
  app.listen(port, () => {
    // Log successful server startup
    logger.info(`Server running on port ${port}`);
  });
});
