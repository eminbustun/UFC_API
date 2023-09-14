const mongoose = require("mongoose");
const express = require("express");
const Club = require("../models/Club");

//* Get all clubs
exports.getClubs = async (req, res, next) => {
  try {
    const clubs = await Club.find();

    if (!clubs) {
      return res.status(400).json({
        success: false,
        error: "No club is found.",
      });
    }

    res.status(200).json({
      success: true,
      clubs,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
    });
  }
};

//* Get a club
exports.getClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(400).json({
        success: false,
        error: "No club is found.",
      });
    }
    res.status(200).json({
      success: true,
      club,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
    });
  }
};

//* Add a club
exports.addClub = async (req, res, next) => {
  try {
    const club = await Club.create(req.body);
    res.status(200).json({
      success: true,
      club,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
    });
  }
};

//* Update a club
exports.updateClub = async (req, res, next) => {
  try {
    const club = await Club.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!club) {
      return res.status(400).json({
        success: false,
        error: "No club is found.",
      });
    }
    res.status(200).json({
      success: true,
      club,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
    });
  }
};

exports.deleteClub = async (req, res, next) => {
  try {
    const club = await Club.findByIdAndDelete(req.params.id);

    if (!club) {
      return res.status(400).json({
        success: false,
        error: "No club is found.",
      });
    }
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
    });
  }
};
