// Users repository - database access layer for user management
// Handles all database operations for user profiles and authentication
const { User } = require("../../db/models");

/**
 * Creates a new user in the database
 * Stores user profile information (name, email, id)
 * @param {Object} userData - User object containing id, name, email properties
 * @returns {Promise<Object>} The saved user document with MongoDB _id and timestamps
 */
const createUser = async function (userData) {
  const user = new User(userData);
  return await user.save();
};

/**
 * Retrieves a user by their unique identifier
 * @param {number} id - The user's unique identifier (numeric ID)
 * @returns {Promise<Object|null>} The user document or null if not found
 */
const findUserById = async function (id) {
  return await User.findOne({ id });
};

/**
 * Retrieves all users from the database
 * @returns {Promise<Array>} Array of all user documents in the system
 */
const findAllUsers = async function () {
  return await User.find({});
};

/**
 * Checks whether a user with the given ID exists in the database
 * Used for validation before creating or accessing user resources
 * @param {number} id - The user ID to check for existence
 * @returns {Promise<boolean>} True if user exists, false otherwise
 */
const checkUserExists = async function (id) {
  const count = await User.countDocuments({ id });
  return count > 0;
};

module.exports = {
  createUser,
  findUserById,
  findAllUsers,
  checkUserExists,
};
