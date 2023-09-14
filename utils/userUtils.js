const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  connectToRedis,
  getRedis,
  removeRedis,
  setRedis,
} = require("../config/redis");
const crypto = require("crypto");

//* Sign JWT and return
getSignedJwtToken = function (userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//* Match users entered password to hashed password in database
exports.matchPassword = async function (enteredPassword, dbPassword) {
  return await bcrypt.compare(enteredPassword, dbPassword);
};

//* Generate and hash password token
exports.getResetPasswordToken = function (user) {
  //* Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  //* Hash token and set to resetPasswordToken field
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //* Set Expire
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

//* Get token from model, create cookie and send response
exports.sendTokenResponse = async (user, statusCode, res) => {
  //! create the token
  const token = getSignedJwtToken(user.id);
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, //? An HttpOnly Cookie is a tag added to a browser cookie that prevents client-side scripts from accessing data.
  };

  await setRedis(user.name, token);
  console.log("Written to the Redis");
  return res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};
