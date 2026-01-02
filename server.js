// Entry point (connect DB, listen)
const createApp = require("./src/app");
const { connectDB } = require("./src/db");
const logger = require("./src/logger");
const config = require("./src/config");

const app = createApp();

connectDB().then(() => {
  const port = config.PORT || 3000;
  app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
  });
});
