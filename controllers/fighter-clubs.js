const express = require("express");
const FighterAndClub = require("../models/FighterAndClub");
const ErrorResponse = require("../error/error-response");

exports.getAllFighters = async (req, res, next) => {
  try {
    const fighters = await FighterAndClub.find({
      club: req.params.id,
    }).populate("fighter", "name");

    if (!fighters) {
      return next(
        new ErrorResponse("No fighter is found related to this club.", 400)
      );
    }

    res.status(200).json({
      success: true,
      fighters,
    });
  } catch (err) {
    console.log(err);
    next(
      "An error occured while getting the fighters who belongs to this club.",
      400
    );
  }
};
