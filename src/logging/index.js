// Pino logger configuration with MongoDB stream
const pino = require("pino");
const createMongoStream = require("./mongo-stream");

// Create a multi-stream logger that writes to both console and MongoDB
const logger = pino(
  {
    level: "info",
  },
  pino.multistream([
    // Stream 1: Write to console (pretty print in development)
    {
      level: "info",
      stream: process.stdout,
    },
    // Stream 2: Write to MongoDB
    {
      level: "info",
      stream: createMongoStream(),
    },
  ])
);

module.exports = logger;
