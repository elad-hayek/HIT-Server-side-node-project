// Entry point (listen without DB)
const createApp = require("./src/app/app");
const { logger } = require("./src/logging");
const config = require("./src/config");

const app = createApp();

const port = config.PORT || 2000;
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
