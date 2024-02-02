const mongoose = require("mongoose");
const express = require("express");
const Fighter = require("../models/Fighter");

const ErrorResponse = require("../error/error-response");

//* Get All Fighters
exports.getFighters = async (req, res, next) => {
  try {
    const totalFighterCount = await Fighter.count();
    const count = req.query.limit || 50;
    const page = req.query.page || 1;
    const name = req.query.name;

    if (name) {
      const fighter = await Fighter.findOne({ name: name });

      if (!fighter) {
        return next(
          new ErrorResponse("Fighter cannot be found with this name.", 400)
        );
      }
      return res.status(200).json({
        success: true,
        fighter,
      });
    }

    if (parseInt(page) === 0) {
      return next(new ErrorResponse("Page number cannot be zero", 400));
    }

    const fighters = await Fighter.find()
      .skip((page - 1) * count)
      .limit(count);

    if (!fighters || fighters.length === 0) {
      return next(new ErrorResponse("No fighter is found.", 400));
    }

    var hasNextPage = count * page < totalFighterCount;
    var hasPreviousPage = page > 1;
    var nextPage = +page + 1;
    var previousPage = page - 1;
    var lastPage = Math.ceil(totalFighterCount / count);

    if (hasPreviousPage == false) {
      previousPage = undefined;
    }
    res.status(200).json({
      success: true,
      count: fighters.length,
      fighters,
      hasNextPage,
      hasPreviousPage,
      nextPage,
      previousPage,
      lastPage,
    });
  } catch (err) {
    console.log(err);
    next(new ErrorResponse("An error is occured while getting fighters"));
  }
};

//* Get A Fighter
exports.getFighter = async (req, res, next) => {
  try {
    const fighter = await Fighter.findById(req.params.id);

    if (!fighter) {
      return next(new ErrorResponse("No fighter is found with this id."));
    }

    res.status(200).json({
      success: true,
      fighter,
    });
  } catch (err) {
    next(new ErrorResponse("An error occured while getting a fighter.", 400));
  }
};

//* Add a fighter
exports.addFighter = async (req, res, next) => {
  try {
    const fighter = await Fighter.create(req.body);

    res //?
      .status(201)
      .json({
        success: true,
        fighter,
      });
  } catch (err) {
    console.log(err);
    next(new ErrorResponse("An error occured while adding a fighter.", 400));
  }
};

//* Add a fighter
exports.addFighterList = async (req, res, next) => {
  try {
    const fighters = await Fighter.create(req.body);

    res //?
      .status(201)
      .json({
        success: true,
        fighters,
      });
  } catch (err) {
    console.log(err);
    next(
      new ErrorResponse(
        "An error occured while adding fighters as a list.",
        400
      )
    );
  }
};

//* Update a fighter
exports.updateFighter = async (req, res, next) => {
  try {
    const fighter = await Fighter.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!fighter) {
      return next(new ErrorResponse("No fighter is found with this id.", 400));
    }

    res.status(200).json({
      success: true,
      fighter,
    });
  } catch (err) {
    console.log(err);
    next(new ErrorResponse("An error occured in updating a fighter.", 400));
  }
};

//* Delete a fighter,
exports.deleteFighter = async (req, res, next) => {
  try {
    const fighter = await Fighter.findByIdAndDelete(req.params.id);

    if (!fighter) {
      return next(new ErrorResponse("No fighter is found with this id", 400));
    }

    res.status(200).json({
      success: true,
      fighter,
    });
  } catch (err) {
    console.log(err);
    next(new ErrorResponse("An error occured while deleting a fighter.", 400));
  }
};
