// Users service - business logic layer
const usersRepository = require("../repositories/users_repository");
const costsClient = require("../../clients/costs_client");
const { logger } = require("../../logging");
const { ValidationError } = require("../../errors/validation_error");
const { NotFoundError } = require("../../errors/not_found_error");
const { DuplicateError } = require("../../errors/duplicate_error");
const { ServiceError } = require("../../errors/service_error");
const { User } = require("../../db/models");

const validateUserData = function (data) {
  const tempUser = new User(data);
  const validationError = tempUser.validateSync();

  if (validationError) {
    const firstErrorKey = Object.keys(validationError.errors)[0];
    const firstError = validationError.errors[firstErrorKey];
    throw new ValidationError(firstError.message);
  }

  return tempUser;
};

const addUser = async function (userData) {
  const validatedUser = validateUserData(userData);

  const exists = await usersRepository.checkUserExists(validatedUser.id);
  if (exists) {
    throw new DuplicateError(`User with id ${validatedUser.id} already exists`);
  }

  try {
    const user = await usersRepository.createUser({
      id: validatedUser.id,
      first_name: validatedUser.first_name,
      last_name: validatedUser.last_name,
      birthday: validatedUser.birthday,
    });

    logger.info({ userId: user.id }, "User created");

    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      birthday: user.birthday,
    };
  } catch (error) {
    if (error.code === 11000) {
      throw new DuplicateError(
        `User with id ${validatedUser.id} already exists`
      );
    }
    throw error;
  }
};

const getAllUsers = async function () {
  const users = await usersRepository.findAllUsers();

  return users.map((user) => ({
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    birthday: user.birthday,
  }));
};

const getUserById = async function (id) {
  const userId = parseInt(id, 10);

  if (isNaN(userId)) {
    throw new ValidationError("Invalid user id");
  }

  const user = await usersRepository.findUserById(userId);

  if (!user) {
    throw new NotFoundError(`User with id ${userId} not found`);
  }

  let totalCosts;
  try {
    totalCosts = await costsClient.getUserTotalCosts(userId);
  } catch (error) {
    if (
      error.code === "ECONNREFUSED" ||
      error.code === "ETIMEDOUT" ||
      error.response?.status >= 500
    ) {
      throw new ServiceError("Costs service unavailable", 503);
    } else if (error.response) {
      throw new ServiceError(
        `Costs service error: ${error.response.statusText}`,
        502
      );
    } else {
      throw new ServiceError("Failed to fetch costs data", 502);
    }
  }

  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    total_costs: totalCosts,
  };
};

const checkUserExists = async function (id) {
  const userId = parseInt(id, 10);

  if (isNaN(userId)) {
    throw new ValidationError("Invalid user id");
  }

  const exists = await usersRepository.checkUserExists(userId);

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
