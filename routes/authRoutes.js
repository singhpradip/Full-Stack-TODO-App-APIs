const express = require("express");
const {
  register,
  resendRegistrationOtp,
  verifyAccount,
  login,
  sendUserInfo,
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

// verify if user is logged in
router.post("/verify-token", authMiddleware.verifyAccessToken, sendUserInfo);


module.exports = router;
