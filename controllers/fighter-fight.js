const express = require("express");
const FighterAndFight = require("../models/FighterAndFight");
const ErrorResponse = require("../error/error-response");

exports.getFightsOfFighter = async (req, res, next) => {
  try {
    const fighterId = req.params.id;
    const fightsWon = await FighterAndFight.find({
      fighter1: fighterId,
    }).populate("fight");
    const fightsLost = await FighterAndFight.find({
      fighter2: fighterId,
    }).populate("fight");

    if (!fightsWon || !fightsLost) {
      return next(new ErrorResponse("No fights are found with this id."));
    }

    const allFights = [...fightsWon, ...fightsLost];

    res.status(200).json({
      success: true,
      length: allFights.length,
      allFights,
    });
  } catch (err) {
    next(
      new ErrorResponse(
        "An error occured while getting fights of a specific fighter.",
        400
      )
    );
  }
};
