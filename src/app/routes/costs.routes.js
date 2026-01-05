const express = require("express");
const { addCost } = require("../controllers/costs.controller");

const router = express.Router();

router.post("/add", addCost);

module.exports = router;
