const Log = require("../db/models/log.model");

function createMongoStream() {
  return {
    write: async (logString) => {
      try {
        const logData = JSON.parse(logString);

        const logDoc = new Log({
          level: logData.level || "info",
          message: logData.msg || logData.message || "",
          timestamp: new Date(logData.time) || new Date(),
          method: logData.req?.method,
          url: logData.req?.url,
          statusCode: logData.res?.statusCode,
          responseTime: logData.responseTime,
        });
        await logDoc.save();
      } catch (error) {
        console.error("Failed to write log to MongoDB:", error);
      }
    },
  };
}
module.exports = createMongoStream;
