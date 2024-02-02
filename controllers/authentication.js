const crypto = require("crypto");
const User = require("../models/User");
const sendMail = require("../utils/sendMail");
const ErrorResponse = require("../error/error-response");

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
    next(err);
  }
};

//* Login User
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //* Validate email and password
    if (!email || !password) {
      return next(new ErrorResponse("Please fill the missing values!", 400));
    }

    //* Check for user
    const user = await User.findOne({ email: email }).select("+password");

    if (!user) {
      return next(
        new ErrorResponse("No user is found with these credentials!", 400)
      );
    }

    //* Check if password matches
    const isMatch = await matchPassword(password, user.password);

    if (!isMatch) {
      return next(new ErrorResponse("Wrong password!", 400));
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    return next(
      new ErrorResponse("Cannot login right now. Try again later", 400)
    );
  }
};

//* Logout
exports.logout = async (req, res, next) => {
  try {
    //console.log(req.user);

    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
    });
  } catch (err) {
    return next(
      new ErrorResponse(
        "You are not logged out. Something's wrong. Try again.",
        400
      )
    );
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
      return next(
        new ErrorResponse("No user found with this resetPasswordToken!", 400)
      );
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
    return next(
      new ErrorResponse(
        "Error occured in showing your profile. Try again later.",
        400
      )
    );
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
    return next(new ErrorResponse("Cannot update details.", 400));
  }
};

//* Update password / PUT
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    //* Check the current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return next(new ErrorResponse("You entered a wrong password", 400));
    }
    user.password = req.body.newPassword;
    await user.save();
    sendTokenResponse(user, 200, res);
  } catch (err) {
    return next(new ErrorResponse("Cannot update password.", 400));
  }
};

//* Forgot password
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new ErrorResponse("User cannot be found", 400));
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

      return next(new ErrorResponse("Email cannot be sent", 400));
    }
  } catch (err) {
    return next(
      new ErrorResponse("Forgot Password is not working. Try again later!")
    );
  }
};
