// Logs routes - defines the /api/logs endpoint
const express = require("express");
const router = express.Router();
const logsController = require("../controllers/logs.controller");

// GET /api/logs - Get all logs
router.get("/logs", logsController.getLogs);
module.exports = router;
