const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ErrorResponse = require("../error/error-response");

//* Protect routes
exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  //* Make sure token exists
  if (!token) {
    return next(new ErrorResponse("No token exists!", 400));
  }

  try {
    //* Verify token
    const decoded = jwt.decode(token);
    const user = await User.findById(decoded.id);

    req.user = user;

    next();
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

//* Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route.`,
          400
        )
      );
    }
    next();
  };
};
