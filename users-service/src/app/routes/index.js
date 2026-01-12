// Routes aggregation module - combines all API route modules for users service
// Provides centralized routing configuration for all user-related endpoints

// Import Express framework for route definition
const express = require("express");
// Import users-specific routes module containing all user endpoint handlers
const usersRoutes = require("./users_routes");
// Create main router instance for API routes
const router = express.Router();

// Mount users routes at root path (all user endpoints available at /api/...)
router.use("/", usersRoutes);

// Export aggregated routes for app mounting
module.exports = router;
