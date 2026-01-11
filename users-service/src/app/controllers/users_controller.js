// Users controller - request/response handling
const usersService = require("../services/users_service");

const addUser = async function (req, res, next) {
  try {
    const requestId = req.id || req.headers["x-request-id"];
    const user = await usersService.addUser(req.body, requestId);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const getUsers = async function (req, res, next) {
  try {
    const requestId = req.id || req.headers["x-request-id"];
    const users = await usersService.getAllUsers(requestId);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async function (req, res, next) {
  try {
    const requestId = req.id || req.headers["x-request-id"];
    const user = await usersService.getUserById(req.params.id, requestId);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const checkUserExists = async function (req, res, next) {
  try {
    const requestId = req.id || req.headers["x-request-id"];
    const result = await usersService.checkUserExists(req.params.id, requestId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addUser,
  getUsers,
  getUserById,
  checkUserExists,
};
