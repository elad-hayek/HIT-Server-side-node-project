const express = require("express");
const usersRoutes = require("./users_routes");
const costsRoutes = require("./costs.routes");

const router = express.Router();

router.use(usersRoutes);
router.use("/", costsRoutes);

module.exports = router;
