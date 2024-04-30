const router = require("express").Router();
const authController = require("../controllers/authController");
const { tryCatch, authorizationAdmin } = require("../middleware/authMiddleware");
const errorHandller = require("../middleware/errorHandller");

router.post("/register", tryCatch(authController.register));
router.post("/login", tryCatch(authController.login));
router.post("/logout", tryCatch(authController.logout));
router.post("/verify_email/:token", tryCatch(authController.verifyEmail));
router.post("/forgot-password", tryCatch(authController.forgotPassword));
router.post("/verify-forgot-password/:token", tryCatch(authController.verifyForgotPassword));
router.get("/myprofile", authorizationAdmin, tryCatch(authController.getLoggedInUserInfo));

router.use(errorHandller);

module.exports = router;
