// Admin routes module - defines HTTP endpoints for admin service

// Import Express framework for route definition
const express = require("express");
// Import admin controller with route handler functions
const adminController = require("../controllers/admin_controller");

// Create Express router instance for admin routes
const router = express.Router();

// Define GET endpoint to retrieve team member information
// Route: GET /api/about
// Handler: Returns JSON array of team members with names
router.get("/about", adminController.getAbout);

// Export router for mounting in main app routes
module.exports = router;
