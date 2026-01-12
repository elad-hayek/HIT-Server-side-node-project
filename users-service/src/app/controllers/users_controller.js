// Users controller module - handles HTTP requests for user management endpoints

// Import users service for business logic
const usersService = require("../services/users_service");

/**
 * Creates a new user in the database
 * Handles POST /api/add requests
 * @param {Object} req - Express request object with user data in body
 * @param {Object} res - Express response object for sending response
 * @param {Function} next - Express next middleware function for error handling
 * @returns {void} Sends 201 Created with user data or error to next
 */
const addUser = async function (req, res, next) {
  try {
    // Validate and create user through service
    const user = await usersService.addUser(req.body);
    // Return 201 Created status with new user object
    res.status(201).json(user);
  } catch (error) {
    // Pass errors to error middleware
    next(error);
  }
};

/**
 * Retrieves all users from the database
 * Handles GET /api/users requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object for sending response
 * @param {Function} next - Express next middleware function for error handling
 * @returns {void} Sends 200 OK with users array or error to next
 */
const getUsers = async function (req, res, next) {
  try {
    // Fetch all users from service layer
    const users = await usersService.getAllUsers();
    // Return 200 OK status with users array
    res.status(200).json(users);
  } catch (error) {
    // Pass errors to error middleware
    next(error);
  }
};

/**
 * Retrieves a specific user by ID with cost information
 * Handles GET /api/users/:id requests
 * @param {Object} req - Express request object with user ID in params
 * @param {Object} res - Express response object for sending response
 * @param {Function} next - Express next middleware function for error handling
 * @returns {void} Sends 200 OK with user data or error to next
 */
const getUserById = async function (req, res, next) {
  try {
    // Fetch user by ID from service layer
    const user = await usersService.getUserById(req.params.id);
    // Return 200 OK status with user object
    res.status(200).json(user);
  } catch (error) {
    // Pass errors to error middleware
    next(error);
  }
};

/**
 * Checks if a user exists in the database
 * Handles GET /api/exists/:id requests
 * @param {Object} req - Express request object with user ID in params
 * @param {Object} res - Express response object for sending response
 * @param {Function} next - Express next middleware function for error handling
 * @returns {void} Sends 200 OK with exists status or error to next
 */
const checkUserExists = async function (req, res, next) {
  try {
    // Check if user exists in database
    const result = await usersService.checkUserExists(req.params.id);
    // Return 200 OK status with exists result
    res.status(200).json(result);
  } catch (error) {
    // Pass errors to error middleware
    next(error);
  }
};

// Export controller functions for route handlers
module.exports = {
  addUser,
  getUsers,
  getUserById,
  checkUserExists,
};
