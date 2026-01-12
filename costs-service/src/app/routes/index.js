// Routes aggregation module - combines all API route modules for costs service
// Provides centralized routing configuration for all cost-related endpoints

// Import Express framework for route definition
const express = require("express");
// Import costs-specific routes module containing all cost endpoint handlers
const costsRoutes = require("./costs_routes");
// Create main router instance for API routes
const router = express.Router();

// Mount costs routes at root path (all cost endpoints available at /api/...)
router.use("/", costsRoutes);

// Export aggregated routes for app mounting
module.exports = router;
