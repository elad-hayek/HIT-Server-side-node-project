// Logs routes - defines the /api/logs endpoint
const express = require("express");
const router = express.Router();
const logsController = require("../controllers/logs_controller");

// GET /api/logs - Get all logs
router.get("/logs", logsController.getLogs);

// POST /api/logs - Receive logs from other services
router.post("/logs", logsController.createLog);

module.exports = router;
