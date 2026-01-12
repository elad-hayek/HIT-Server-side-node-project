// Users routes module - defines HTTP endpoints for user management
// Provides routes for creating users, retrieving profiles, and checking existence

// Import Express framework for route definition
const express = require("express");
// Import users controller with route handler functions
const usersController = require("../controllers/users_controller");

// Create Express router instance for users routes
const router = express.Router();

// POST endpoint to create a new user
// Route: POST /api/add
// Handler: Validates user data, checks for duplicates, and persists to database
router.post("/add", usersController.addUser);

// GET endpoint to retrieve all users
// Route: GET /api/users
// Handler: Fetches all user profiles from database
router.get("/users", usersController.getUsers);

// GET endpoint to retrieve a specific user by ID with cost information
// Route: GET /api/users/:id
// Handler: Returns user profile with total costs from costs service
router.get("/users/:id", usersController.getUserById);

// GET endpoint to check if a user exists
// Route: GET /api/exists/:id
// Handler: Validates user existence for inter-service communication
router.get("/exists/:id", usersController.checkUserExists);

// Export router for mounting in main routes aggregation
module.exports = router;
