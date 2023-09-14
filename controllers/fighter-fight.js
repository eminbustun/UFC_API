const express = require("express");
const FighterAndFight = require("../models/FighterAndFight");

exports.getFightsOfFighter = async (req, res, next) => {
  try {
    const fighterId = req.params.id;
    const fightsWon = await FighterAndFight.find({
      fighter1: fighterId,
    }).populate("fight");
    const fightsLost = await FighterAndFight.find({
      fighter2: fighterId,
    }).populate("fight");

    if (!fighterId) {
      return res.status(400).json({
        success: false,
        message: "Fighter id cannot be found.",
      });
    }

    const allFights = [...fightsWon, ...fightsLost];

    res.status(200).json({
      success: true,
      length: allFights.length,
      allFights,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err,
    });
  }
};
