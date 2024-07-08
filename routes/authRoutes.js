const express = require("express");
const {
  register,
  resendRegistrationOtp,
  login,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post(
  "/register/resendOtp",
  authMiddleware.verifyTempToken,
  resendRegistrationOtp
);


router.post("/login", login);

module.exports = router;
