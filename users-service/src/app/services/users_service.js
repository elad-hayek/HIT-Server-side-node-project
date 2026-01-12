// Users service - business logic layer
// Handles user validation, CRUD operations, and cost integration via external service
const usersRepository = require("../repositories/users_repository");
const costsClient = require("../../clients/costs_client");
const { logger } = require("../../logging");
const { ValidationError } = require("../../errors/validation_error");
const { NotFoundError } = require("../../errors/not_found_error");
const { DuplicateError } = require("../../errors/duplicate_error");
const { ServiceError } = require("../../errors/service_error");
const { User } = require("../../db/models");

/**
 * Validates user data against the User model schema
 * Ensures all required fields are present and valid
 * @param {Object} data - User data object with id, first_name, last_name, birthday
 * @returns {Object} Validated user object
 * @throws {ValidationError} If user data fails schema validation
 */
const validateUserData = function (data) {
  // Create temporary user to validate against Mongoose schema
  const tempUser = new User(data);
  const validationError = tempUser.validateSync();

  // If schema validation fails, extract and throw the first error
  if (validationError) {
    const firstErrorKey = Object.keys(validationError.errors)[0];
    const firstError = validationError.errors[firstErrorKey];
    throw new ValidationError(firstError.message);
  }

  return tempUser;
};

/**
 * Creates a new user with validation and duplicate checking
 * Validates user data, checks for existing user, and persists to database
 * @param {Object} userData - User object with id, first_name, last_name, birthday
 * @returns {Promise<Object>} Formatted user response with all fields
 * @throws {ValidationError} If user data is invalid
 * @throws {DuplicateError} If user with same id already exists
 */
const addUser = async function (userData) {
  // Validate user data against schema constraints
  const validatedUser = validateUserData(userData);

  // Check if user with this id already exists to prevent duplicates
  const exists = await usersRepository.checkUserExists(validatedUser.id);
  if (exists) {
    throw new DuplicateError(`User with id ${validatedUser.id} already exists`);
  }

  try {
    // Persist user to database with validated data
    const user = await usersRepository.createUser({
      id: validatedUser.id,
      first_name: validatedUser.first_name,
      last_name: validatedUser.last_name,
      birthday: validatedUser.birthday,
    });

    // Log successful user creation for audit trail
    logger.info({ userId: user.id }, "User created");

    // Return formatted response with all relevant fields
    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      birthday: user.birthday,
    };
  } catch (error) {
    // Handle MongoDB duplicate key error (mongoDB-specific error code)
    if (error.code === 11000) {
      throw new DuplicateError(
        `User with id ${validatedUser.id} already exists`
      );
    }
    throw error;
  }
};

/**
 * Retrieves all users from the database and formats them
 * Returns users in a consistent format for API responses
 * @returns {Promise<Array>} Array of formatted user objects
 */
const getAllUsers = async function () {
  // Fetch all users from repository
  const users = await usersRepository.findAllUsers();

  // Format each user with consistent field structure for response
  return users.map((user) => ({
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    birthday: user.birthday,
  }));
};

/**
 * Retrieves a specific user with their total costs from costs service
 * Integrates user profile data with cost information via external service call
 * @param {string|number} id - User ID to retrieve
 * @returns {Promise<Object>} User object with total_costs field
 * @throws {ValidationError} If id is not a valid number
 * @throws {NotFoundError} If user doesn't exist
 * @throws {ServiceError} If costs service is unavailable
 */
const getUserById = async function (id) {
  // Parse and validate user ID parameter
  const userId = parseInt(id, 10);

  if (isNaN(userId)) {
    throw new ValidationError("Invalid user id");
  }

  // Query user from repository by ID
  const user = await usersRepository.findUserById(userId);

  if (!user) {
    throw new NotFoundError(`User with id ${userId} not found`);
  }

  // Fetch total costs from external costs service
  let totalCosts;
  try {
    totalCosts = await costsClient.getUserTotalCosts(userId);
  } catch (error) {
    // Handle service communication errors (connection refused, timeout, 5xx)
    if (
      error.code === "ECONNREFUSED" ||
      error.code === "ETIMEDOUT" ||
      error.response?.status >= 500
    ) {
      throw new ServiceError("Costs service unavailable", 503);
    } else if (error.response) {
      // Handle HTTP error responses from costs service
      throw new ServiceError(
        `Costs service error: ${error.response.statusText}`,
        502
      );
    } else {
      // Handle unexpected errors during service call
      throw new ServiceError("Failed to fetch costs data", 502);
    }
  }

  // Return formatted response with user and costs data
  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    total_costs: totalCosts,
  };
};

/**
 * Checks if a user with the given ID exists in the system
 * Validates ID format and queries repository for existence
 * @param {string|number} id - User ID to check for existence
 * @returns {Promise<Object>} Object with exists boolean and userId
 * @throws {ValidationError} If id is not a valid number
 */
const checkUserExists = async function (id) {
  // Parse and validate user ID parameter
  const userId = parseInt(id, 10);

  if (isNaN(userId)) {
    throw new ValidationError("Invalid user id");
  }

  // Query repository to check if user exists
  const exists = await usersRepository.checkUserExists(userId);

  // Return formatted response with existence flag
  return {
    exists,
    userId,
  };
};

module.exports = {
  addUser,
  getAllUsers,
  getUserById,
  checkUserExists,
};
