// Users repository - database access layer
const { User } = require("../../db/models");

const createUser = async function (userData) {
  const user = new User(userData);
  return await user.save();
};

const findUserById = async function (id) {
  return await User.findOne({ id });
};

const findAllUsers = async function () {
  return await User.find({});
};

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
