// Routes aggregation module - combines all API route modules for logs service
// Provides centralized routing configuration for all log-related endpoints

// Import Express framework for route definition
const express = require("express");
// Import logs-specific routes module containing all log endpoint handlers
const logsRoutes = require("./log_routes");
// Create main router instance for API routes
const router = express.Router();

// Mount logs routes at root path (all log endpoints available at /api/...)
router.use("/", logsRoutes);

// Export aggregated routes for app mounting
module.exports = router;
