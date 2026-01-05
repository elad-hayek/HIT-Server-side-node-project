const express = require("express");
const usersRoutes = require("./users_routes");

const router = express.Router();

router.use(usersRoutes);

module.exports = router;

