const express = require("express");
const {
  addCost,
  getMonthlyReport,
  getTotalCosts,
} = require("../controllers/costs_controller");

const router = express.Router();

router.post("/add", addCost);
router.get("/report", getMonthlyReport);
router.get("/total", getTotalCosts);

module.exports = router;
