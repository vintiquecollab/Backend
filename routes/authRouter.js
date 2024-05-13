const router = require("express").Router();
const authController = require("../controllers/authController");
const { tryCatch, authorizationAdmin } = require("../middleware/authMiddleware");
const errorHandller = require("../middleware/errorHandller");
const  photoUpload = require('../middleware/photoUpload')

router.post("/register",photoUpload.single("image"), tryCatch(authController.createAdmin));
router.post("/login", tryCatch(authController.login));
router.post("/logout", tryCatch(authController.logout));
router.post("/verify_email/:token", tryCatch(authController.verifyEmail));
router.post("/forgot-password", tryCatch(authController.forgotPassword));
router.post("/verify-forgot-password/:token", tryCatch(authController.verifyForgotPassword));
router.get("/myprofile",photoUpload.single("image"), authorizationAdmin, tryCatch(authController.getLoggedInUserInfo));
router.get("/user",photoUpload.single("image"), tryCatch(authController.getAllUsers));
router.get("/:id",photoUpload.single("image"), tryCatch(authController.getUserById));
router.put("/:id",photoUpload.single("image"), tryCatch(authController.updateUser))
router.delete("/:id" ,tryCatch(authController.deleteUser))
router.use(errorHandller);

module.exports = router;
