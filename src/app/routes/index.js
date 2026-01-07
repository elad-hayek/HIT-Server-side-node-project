// Main routes file - connects all route modules
const express = require("express");
const router = express.Router();
const logsRoutes = require("../../routes/log.routes");
router.use("/", logsRoutes);
module.exports = router;
