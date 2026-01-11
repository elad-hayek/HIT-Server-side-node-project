// Users controller - request/response handling
const usersService = require("../services/users_service");

const addUser = async function (req, res, next) {
  try {
    const user = await usersService.addUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const getUsers = async function (req, res, next) {
  try {
    const users = await usersService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async function (req, res, next) {
  try {
    const user = await usersService.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const checkUserExists = async function (req, res, next) {
  try {
    const result = await usersService.checkUserExists(req.params.id);
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
