// Users routes
const express = require("express");
const usersController = require("../controllers/users_controller");

const router = express.Router();

router.post("/add", usersController.addUser);
router.get("/users", usersController.getUsers);
router.get("/users/:id", usersController.getUserById);

module.exports = router;
