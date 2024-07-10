const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const { successResponse, sendError } = require("../utils/responseUtils");
const {
  secretKey,
  expiresIn,
  OTPexpiresIn,
  nodeEnvironment,
} = require("../config/config");
const { sendVerificationEmail } = require("../utils/sendVerificationEmail");

const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
};
const generateTempToken = (email, name) => {
  return jwt.sign({ email: email, name: name }, secretKey, {
    expiresIn: OTPexpiresIn,
  });
};
const sendOtp = async (email, name = null) => {
  try {
    const otp = generateOTP();
    await sendVerificationEmail(email, otp, name);

    const tempToken = generateTempToken(email, name);
    // console.log({ OTP: otp, Token: tempToken });
    // console.log("OTP sent successfully to:", email);
    return { tempToken, otp };
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

const generateAccessToken = (userData) => {
  return jwt.sign(userData, secretKey, { expiresIn });
};

const register = async (req, res) => {
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
      secure: nodeEnvironment === "production",
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

const resendRegistrationOtp = async (req, res) => {
  try {
    const { email, name } = req.body;
    const { user } = req.body;

    if (!user) {
      return sendError(res, "User not found", 404);
    }
    if (user.isVerified) {
      return sendError(res, "Your account is already verified", 400);
    }

    const { tempToken, otp } = await sendOtp(email, name);

    user.otp = otp;
    await user.save();

    res.cookie("tempToken", tempToken, {
      httpOnly: true,
      secure: nodeEnvironment === "production",
    });

    return successResponse(res, "OTP Resent Successfully");
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

const verifyAccount = async (req, res) => {
  try {
    const { otp, user } = req.body;
    if (!user) {
      return sendError(res, "User not found", 404);
    }
    if (user.isVerified) {
      return sendError(
        res,
        "User already registered, Proceed to login or use another email",
        400
      );
    }
    if (user.otp !== otp) {
      return sendError(res, "Invalid OTP, not matched", 400);
    }

    user.isVerified = true;
    user.otp = null;
    await user.save();

    const userData = {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePicture: user.profilePicture,
      isDarkMode: user.isDarkMode,
      isVerified: user.isVerified,
    };

    const token = generateAccessToken(userData);

    res.clearCookie("tempToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: nodeEnvironment === "production",
    });

    console.log("Logged In as_________________________" + user.name);
    return successResponse(res, "User logged in successfully", userData);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return sendError(res, "Invalid email or password", 402);
    }

    if (!user.isVerified) {
      console.log(
        "User is not verified\nTODO: redirect user to the OTP Verification page with email payload"
      );
      return sendError(
        res,
        "Your account is not verified, Please sign up again  !",
        403
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return sendError(res, "Invalid email or password", 401);
    }

    const userData = {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePicture: user.profilePicture,
      isDarkMode: user.isDarkMode,
      isVerified: user.isVerified,
    };

    const token = generateAccessToken(userData);

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: nodeEnvironment === "production",
    });

    console.log(
      "Logged In as_________________________" +
        user.firstName +
        " " +
        user.lastName
    );
    return successResponse(res, "User logged in successfully", userData);
  } catch (error) {
    return sendError(res, "Internal server error", 500);
  }
};

const sendUserInfo = (req, res) => {
  const { user } = req.body;
  const userData = {
    userId: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    profilePicture: user.profilePicture,
    isDarkMode: user.isDarkMode,
    isVerified: user.isVerified,
  };
  return successResponse(res, "Token is valid", userData);
};

module.exports = {
  register,
  login,
  resendRegistrationOtp,
  verifyAccount,
  sendUserInfo,
};
