const jwt = require("jsonwebtoken");
const { secretKey } = require("../config/config");
const User = require("../models/userSchema");
const { sendError } = require("../utils/responseUtils");

const verifyTempToken = async (req, res, next) => {
  // console.log(req.cookies)
  const token = req.cookies.tempToken;

  if (!token) {
    console.log("No token received");
    return sendError(res, "Authorization token is missing", 401);
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    const { email, name } = decoded;
    const user = await User.findOne({ email });
    // console.log(user);
    if (!user) {
      return sendError(res, "Not the correct Token !", 404);
    }

    req.body.email = email;
    req.body.name = name;
    req.body.user = user;
    // console.log("Token: PASS");
    next();
  } catch (error) {
    console.log("Invalid token, ERROR:\n ", error);
    return sendError(res, "Session Expired, try again later", 401);
  }
};

const verifyAccessToken = async (req, res, next) => {
  const token = req.cookies.accessToken;
  // console.log(token);

  if (!token) {
    console.log("No token received");
    return sendError(res, "Authorization token is missing", 401);
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    // console.log(decoded);
    const { userId, passwordVersion } = decoded;
    // console.log(passwordVersion + " \n" + userId);

    const user = await User.findById(userId);
    if (!user) {
      return sendError(res, "User not found", 404);
    }
    if (user.passwordVersion !== passwordVersion) {
      return sendError(res, "Token has expired. Please reauthenticate.", 401);
    }
    // console.log("Valid Token for :", user._id);

    req.body.user = user;
    // console.log("middleware: PASS");

    next();
  } catch (error) {
    console.log(error);
    return sendError(res, "Invalid token", 401);
  }
};

module.exports = {
  verifyTempToken,
  verifyAccessToken,
};
