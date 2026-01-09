// Main routes file - connects all route modules
const express = require("express");
const costsRoutes = require("./costs_routes");
const router = express.Router();

router.use("/", costsRoutes);

module.exports = router;
