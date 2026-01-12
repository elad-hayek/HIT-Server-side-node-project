// Database connection module - manages MongoDB connections

// Import Mongoose ODM library
const mongoose = require("mongoose");
// Import MongoDB URI from configuration
const config = require("../config");
// Import logger for connection logging
const { logger } = require("../logging");

/**
 * Establishes connection to MongoDB database
 * Logs connection status and exits on failure
 * @returns {Promise<void>} Resolves on success, exits process on failure
 */
const connectDB = async function () {
  try {
    // Connect to MongoDB using configured URI
    await mongoose.connect(config.MONGO_URI);
    // Log successful connection
    logger.info("MongoDB connected");
  } catch (err) {
    // Log connection error
    logger.error("MongoDB connection error", err);
    // Exit process on failure
    process.exit(1);
  }
};

// Export database connection function
module.exports = { connectDB };
