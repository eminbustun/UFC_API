const mongoose = require("mongoose");
const express = require("express");
const Club = require("../models/Club");
const ErrorResponse = require("../error/error-response");

//* Get all clubs
exports.getClubs = async (req, res, next) => {
  try {
    const clubs = await Club.find();

    if (!clubs || clubs.length === 0) {
      return next(new ErrorResponse("No club is found.", 400));
    }

    res.status(200).json({
      success: true,
      clubs,
    });
  } catch (err) {
    console.log(err);
    next("An error occured while getting the clubs.", 400);
  }
};

//* Get a club
exports.getClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return next("No club is found with this id.", 400);
    }
    res.status(200).json({
      success: true,
      club,
    });
  } catch (err) {
    console.log(err);
    next("An error occured while getting the specific club.", 400);
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
    next("An error occured while adding a club.", 400);
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
      return next("No club is found with this id.", 400);
    }
    res.status(200).json({
      success: true,
      club,
    });
  } catch (err) {
    console.log(err);
    next("An error occured while updating a club.", 400);
  }
};

exports.deleteClub = async (req, res, next) => {
  try {
    const club = await Club.findByIdAndDelete(req.params.id);

    if (!club) {
      return next("No club is found with this id.", 400);
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
