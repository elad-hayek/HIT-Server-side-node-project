// Logs routes module - defines HTTP endpoints for log management
// Provides routes for retrieving and storing centralized logs from all services

// Import Express framework for route definition
const express = require("express");
// Create Express router instance for logs routes
const router = express.Router();
// Import logs controller with route handler functions
const logsController = require("../controllers/logs_controller");

// GET endpoint to retrieve all stored logs
// Route: GET /api/logs
// Handler: Fetches all log entries from database sorted by timestamp
router.get("/logs", logsController.getLogs);

// POST endpoint to create and store a new log entry
// Route: POST /api/logs
// Handler: Validates log data and persists to database (called by other services)
router.post("/logs", logsController.createLog);

// Export router for mounting in main routes aggregation
module.exports = router;
