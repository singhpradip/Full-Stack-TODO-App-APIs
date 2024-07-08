const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const { successResponse, sendError } = require("../utils/responseUtils");
const { secretKey, expiresIn, OTPexpiresIn } = require("../config/config");
const { sendVerificationEmail } = require("../utils/sendVerificationEmail");

const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
};
const generateTempToken = (email) => {
  return jwt.sign({ email: email }, secretKey, {
    expiresIn: OTPexpiresIn,
  });
};

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      darkMode: user.darkMode,
      tokenVersion: user.tokenVersion,
    },
    secretKey,
    { expiresIn }
  );
};

const sendOtp = async (email, name = null) => {
  try {
    const otp = generateOTP();
    await sendVerificationEmail(email, otp, name);

    const tempToken = generateTempToken(email);
    // console.log({ OTP: otp, Token: tempToken });
    // console.log("OTP sent successfully to:", email);
    return { tempToken, otp };
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

const register = async (req, res) => {
  console.log("register is called");
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return sendError(res, "all fields are required", 400);
  }
  if (password !== confirmPassword) {
    return sendError(res, "Password do not match", 400);
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return sendError(
        res,
        "User already registered, Proceed to login or use new email",
        400
      );
    }

    const { tempToken, otp } = await sendOtp(email, firstName + " " + lastName);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate(
      { email },
      {
        firstName,
        lastName,
        password: hashedPassword,
        otp,
      },
      { new: true, upsert: true }
    );

    if (!user) {
      return sendError(res, "Failed to register user", 500);
    }
    res.cookie("tempToken", tempToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return successResponse(
      res,
      "Please verify your account using OTP sent to your email",
      user.email
    );
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {};

module.exports = { register, login };
