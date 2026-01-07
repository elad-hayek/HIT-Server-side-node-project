// Main routes file - connects all route modules
const express = require("express");
const usersRoutes = require("./users_routes");
const costsRoutes = require("./costs.routes");
const logsRoutes = require("../../routes/log.routes");
const router = express.Router();

router.use("/", usersRoutes);
router.use("/", costsRoutes);
router.use("/", logsRoutes);

module.exports = router;
