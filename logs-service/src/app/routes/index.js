// Main routes file - connects all route modules
const express = require("express");
const logsRoutes = require("./log_routes");
const router = express.Router();

router.use("/", logsRoutes);

module.exports = router;
