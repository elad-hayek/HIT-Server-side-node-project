// Costs routes module - defines HTTP endpoints for cost management
// Provides routes for adding costs, retrieving reports, and calculating totals

// Import Express framework for route definition
const express = require("express");
// Import costs controller with route handler functions
const costsController = require("../controllers/costs_controller");

// Create Express router instance for costs routes
const router = express.Router();

// POST endpoint to add a new cost entry
// Route: POST /api/add
// Handler: Validates cost data, checks user exists, and persists to database
router.post("/add", costsController.addCost);

// GET endpoint to retrieve monthly cost report by category
// Route: GET /api/report?id=<userid>&year=<year>&month=<month>
// Handler: Returns aggregated costs organized by category for specified month
router.get("/report", costsController.getMonthlyReport);

// GET endpoint to get total costs for a user
// Route: GET /api/user-total?userId=<userid>
// Handler: Calculates and returns sum of all costs for user
router.get("/user-total", costsController.getUserTotalCosts);

// Export router for mounting in main routes aggregation
module.exports = router;
