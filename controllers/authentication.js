const crypto = require("crypto");
const User = require("../models/User");
const sendMail = require("../utils/sendMail");
const redis = require("redis");
const {
  connectToRedis,
  getRedis,
  removeRedis,
  setRedis,
} = require("../config/redis");
const bcrypt = require("bcryptjs");

const {
  matchPassword,
  getResetPasswordToken,
  sendTokenResponse,
  passwordHashing,
} = require("../utils/userUtils");

//* Register User
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      role: "normal",
    });

    //! create the token
    //? sendTokenResponse(user, 200, res); we do not need that

    res.status(201).json({
      success: true,
      message: "You are registered.",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err,
    });
  }
};

//* Login User
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //* Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide email and password",
      });
    }

    //* Check for user
    const user = await User.findOne({ email: email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid credentials.",
      });
    }

    //* Check if password matches
    const isMatch = await matchPassword(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err,
    });
  }
};

//* Logout
exports.logout = async (req, res, next) => {
  try {
    //console.log(req.user);

    await removeRedis(req.user.name);
    return res.status(200).json({
      message: "You successfully logged out.",
      success: true,
    });
  } catch (err) {
    return res.status(400).json({
      message: "You are not logged out.",
      success: false,
    });
  }
};

//* Reset password
exports.resetPassword = async (req, res, next) => {
  try {
    //* Get hashed token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resettoken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid token.",
      });
    }

    //* Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err,
    });
  }
};

//* Get current logged in user
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
    });
  }
};

//* Update user details / PUT / auth/updatedetails
exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
    };
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err,
    });
  }
};

//* Update password / PUT
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    //* Check the current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(400).json({
        success: false,
      });
    }
    user.password = req.body.newPassword;
    await user.save();
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err,
    });
  }
};

//* Forgot password
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "There is no user with this email",
      });
    }

    //* Get reset token
    const resetToken = getResetPasswordToken(user);

    await user.save({ validateBeforeSave: false });
    //* Create reset url
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/mma-api/authentication/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reet of a password. Please make a request to: \n\n ${resetUrl}`;

    try {
      await sendMail({
        email: user.email,
        subject: "Password reset",
        message,
      });
      res.status(200).json({ success: true, data: "Email sent" });
    } catch (err) {
      console.log(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        error: "Email could not be sent",
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
    });
  }
};
