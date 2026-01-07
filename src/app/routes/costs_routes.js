const express = require("express");
const {
  addCost,
  getMonthlyReport,
} = require("../controllers/costs_controller");

const router = express.Router();

router.post("/add", addCost);
router.get("/report", getMonthlyReport);

module.exports = router;
