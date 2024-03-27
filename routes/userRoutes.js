const express = require("express");
// const verifyToken = require("../middleware/isAuthenticated");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");
// const isAdmin = require("../middleware/isAdmin");

router.post("/signup", userController.signupController);

router.post("/login", userController.loginController);
router.get("/me", verifyToken, userController.myProfile);
router.get("/", verifyToken, userController.getUsersController);
router.get("/:id", verifyToken, userController.getUsersByIdController);
router.put("/:id", verifyToken, userController.updateUserController);

module.exports = router;
