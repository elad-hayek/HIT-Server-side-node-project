// Logs repository - database access layer
const Log = require("../../db/models/log.model");

const createLog = async function (logData) {
  const log = new Log(logData);
  return await log.save();
};

const findAllLogs = async function () {
  return await Log.find().sort({ timestamp: -1 });
};

const findLogById = async function (id) {
  return await Log.findById(id);
};

module.exports = {
  createLog,
  findAllLogs,
  findLogById,
};
