// HTTP logger middleware using pino-http
const pinoHttp = require("pino-http");
const logger = require("../logging");

const httpLogger = pinoHttp({
  logger,
});

module.exports = httpLogger;
