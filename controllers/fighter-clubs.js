const express = require("express");
const FighterAndClub = require("../models/FighterAndClub");

exports.getAllFighters = async (req, res, next) => {
  try {
    const fighters = await FighterAndClub.find({
      club: req.params.id,
    }).populate("fighter", "name");

    if (!fighters) {
      return res.status(400).json({
        success: false,
        error: "No fighter is found.",
      });
    }

    res.status(200).json({
      success: true,
      fighters,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
    });
  }
};
