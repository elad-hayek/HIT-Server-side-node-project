// HTTP logger middleware using pino-http
const pinoHttp = require("pino-http");
const { logger } = require("../../logging");

const httpLogger = pinoHttp({
  logger,
  customLogLevel: function (req, res, err) {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return "warn";
    } else if (res.statusCode >= 500 || err) {
      return "error";
    }
    return "info";
  },
  customSuccessMessage: function (req, res) {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },
  customErrorMessage: function (req, res, err) {
    return `${req.method} ${req.url} ${res.statusCode} - ${err.message}`;
  },
});

const loggingMiddleware = function (req, res, next) {
  httpLogger(req, res, next);
};

module.exports = loggingMiddleware;
