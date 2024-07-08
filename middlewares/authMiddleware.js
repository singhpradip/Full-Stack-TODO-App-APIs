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
    const { email, name } = decoded;
    const user = await User.findOne({ email });
    // console.log(user);
    if (!user) {
      return sendError(res, "Not the correct Token !", 404);
    }

    // const user = {
    //   firstName: isUser.firstName,
    //   lastName: isUser.lastName,
    //   email: isUser.email,
    //   _id: isUser._id,
    //   isDarkMode: isUser.isDarkMode,
    //   profilePicture: isUser.profilePicture,
    //   isVerified: isUser.isVerified,
    //   passwordVersion: isUser.passwordVersion,
    // };

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

module.exports = {
  verifyTempToken,
};
