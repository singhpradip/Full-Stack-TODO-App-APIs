const express = require("express");
const {
  register,
  resendRegistrationOtp,
  verifyAccount,
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

router.post(
  "/register/verify-account",
  authMiddleware.verifyTempToken,
  //   validateUserData
  verifyAccount
);


router.post("/login", login);

module.exports = router;
