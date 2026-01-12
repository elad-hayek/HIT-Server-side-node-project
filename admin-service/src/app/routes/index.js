// Main routes aggregation module - combines all API route modules

// Import Express router for route definition
const express = require("express");
// Import admin-specific routes module
const adminRoutes = require("./admin_routes");
// Create main router instance for API routes
const router = express.Router();

// Mount admin routes at root path (handles /about endpoint)
router.use("/", adminRoutes);

// Export aggregated routes for app mounting
module.exports = router;
