const jwt = require("jsonwebtoken");
const { secretKey } = require("../config/config");
const User = require("../models/userSchema");
const { sendError } = require("../utils/responseUtils");

const verifyTempToken = async (req, res, next) => {
  const token = req.cookies.tempToken;

  if (!token) {
    console.log("No token received");
    return sendError(res, "Authorization token is missing", 401);
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    console.log(decoded);
    const { email, name } = decoded;
    // console.log("Email:" + email);
    const user = await User.findOne({ email });
    // console.log(user);
    if (!user) {
      return sendError(res, "Not the correct Token !", 404);
    }
    req.body.email = email;
    req.body.name = name;
    console.log("Token: PASS");
    next();
  } catch (error) {
    console.log("Invalid token, ERROR:\n ", error);
    return sendError(res, "Session Expired, try again later", 401);
  }
};

module.exports = {
  verifyTempToken,
};
