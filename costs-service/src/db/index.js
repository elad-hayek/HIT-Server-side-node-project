// Database connection module - establishes MongoDB connection

// Import Mongoose for database operations
const mongoose = require("mongoose");
// Import configuration with database connection URI
const config = require("../config");
// Import logger for database event logging
const { logger } = require("../logging");

/**
 * Connects to MongoDB database using Mongoose
 * Logs connection status and exits process on failure
 * @returns {Promise<void>} Resolves when connected, exits on error
 */
const connectDB = async function () {
  try {
    // Attempt to establish MongoDB connection
    await mongoose.connect(config.MONGO_URI);
    // Log successful connection to database
    logger.info("MongoDB connected");
  } catch (err) {
    // Log connection error with details
    logger.error("MongoDB connection error", err);
    // Exit process immediately on connection failure
    process.exit(1);
  }
};

// Export database connection function for server startup
module.exports = { connectDB };
