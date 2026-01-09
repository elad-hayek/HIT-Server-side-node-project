const express = require("express");
const costsController = require("../controllers/costs_controller");

const router = express.Router();

router.post("/add", costsController.addCost);
router.get("/report", costsController.getMonthlyReport);
router.get("/user-total", costsController.getUserTotalCosts);

module.exports = router;
