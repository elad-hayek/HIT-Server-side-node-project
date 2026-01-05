// HTTP logger middleware using pino-http
const pinoHttp = require("pino-http");
const logger = require("../../logging");
const loggingClient = require("../../clients/logging_client");

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
  const startTime = Date.now();
  
  loggingClient.logRequest({
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query,
    request_id: req.id || req.headers["x-request-id"],
  });
  
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - startTime;
    
    loggingClient.logResponse({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration,
      request_id: req.id || req.headers["x-request-id"],
    });
    
    originalSend.call(this, data);
  };
  
  httpLogger(req, res, next);
};

module.exports = loggingMiddleware;
