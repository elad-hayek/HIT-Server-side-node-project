// Project Members repository - database access layer
const { ProjectMember } = require("../../db/models");

const getAllProjectMembers = async function () {
  return await ProjectMember.find({});
};

module.exports = {
  getAllProjectMembers,
};
