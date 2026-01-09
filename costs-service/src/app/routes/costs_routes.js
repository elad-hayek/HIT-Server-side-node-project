const express = require("express");
const {
  addCost,
  getMonthlyReport,
  getTotalCosts: getUserTotalCosts,
} = require("../controllers/costs_controller");

const router = express.Router();

router.post("/add", addCost);
router.get("/report", getMonthlyReport);
router.get("/user-total", getUserTotalCosts);

module.exports = router;
