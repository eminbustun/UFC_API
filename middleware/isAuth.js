const jwt = require("jsonwebtoken");
const User = require("../models/User");
const redis = require("redis");
const redisUtils = require("../config/redis");

//* Protect routes
exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  /*
  else if (req.cookies.token){
    token = req.cookies.token
  }
  */

  //* Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      error: "No token exists",
    });
  }

  try {
    //* Verify token
    const decoded = jwt.decode(token);
    const user = await User.findById(decoded.id);
    const value = await redisUtils.getRedis(user.name);
    // Use the value here

    if (value === null) {
      return res.status(400).json({
        message: "You are not authorized.",
        success: false,
      });
    }

    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: "error",
    });
  }
};

//* Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(400).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route.`,
      });
    }
    next();
  };
};
