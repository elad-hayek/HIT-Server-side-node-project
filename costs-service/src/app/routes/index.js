// Main routes file - connects all route modules
const express = require("express");
const costsRoutes = require("./costs_routes");
const router = express.Router();

router.use("/costs", costsRoutes);
router.use("/internal/costs", costsRoutes);

module.exports = router;
