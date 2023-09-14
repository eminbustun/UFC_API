const mongoose = require("mongoose");
const express = require("express");
const Fighter = require("../models/Fighter");
const FighterAndClub = require("../models/FighterAndClub");
const Club = require("../models/Club");
const Fight = require("../models/Fight");

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
        return res.status(400).json({
          success: false,
          error: "Fighters are not found.",
        });
      }
      return res.status(200).json({
        success: true,
        fighter,
      });
    }

    if (parseInt(page) === 0) {
      return res.status(400).json({
        success: false,
        message: "Page number cannot be zero.",
      });
    }

    const fighters = await Fighter.find()
      .skip((page - 1) * count)
      .limit(count);

    if (!fighters) {
      return res.status(404).json({
        success: false,
        error: "Fighters are not found.",
      });
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
    res.status(404).json({
      success: false,
      error: err,
    });
  }
};

//* Get A Fighter
exports.getFighter = async (req, res, next) => {
  try {
    const fighter = await Fighter.findById(req.params.id);

    if (!fighter) {
      return res.status(400).json({
        success: false,
        error: "Fighter is not found.",
      });
    }

    res.status(200).json({
      success: true,
      fighter,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
    });
  }
};

//* Add a fighter
exports.addFighter = async (req, res, next) => {
  try {
    const fighter = await Fighter.create(req.body);

    var club = await Club.findOne({ name: fighter.trains_at });
    if (!club) {
      club = await Club.create({ name: fighter.trains_at });
    }

    FighterAndClub.create({ fighter: fighter._id, club: club._id });

    res //?
      .status(201)
      .json({
        success: true,
        fighter,
      });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
    });
  }
};

//* Add a fighter
exports.addFighterList = async (req, res, next) => {
  try {
    const fighters = await Fighter.create(req.body);

    for (let index = 0; index < fighters.length; index++) {
      var club = await Club.findOne({ name: fighters[index].trains_at });
      if (!club) {
        club = await Club.create({ name: fighters[index].trains_at });
      }

      FighterAndClub.create({ fighter: fighters[index]._id, club: club._id });
    }

    res //?
      .status(201)
      .json({
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

//* Update a fighter
exports.updateFighter = async (req, res, next) => {
  try {
    const fighter = await Fighter.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!fighter) {
      return res.status(400).json({
        success: false,
        error: "Fighter is not found.",
      });
    }

    res.status(200).json({
      success: true,
      fighter,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
    });
  }
};

//* Delete a fighter,
exports.deleteFighter = async (req, res, next) => {
  try {
    const fighter = await Fighter.findByIdAndDelete(req.params.id);

    if (!fighter) {
      return res.status(400).json({
        success: false,
        error: "Fighter is not found.",
      });
    }
    //! buraya if(!fighter eklenecek)
    res.status(200).json({
      success: true,
      fighter,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
    });
  }
};

exports.searchFighter = async (req, res, next) => {
  try {
    const fighters = await Fighter.find({ name: req.params.name });

    if (!fighters || fighters.length == 0) {
      return res.status(400).json({
        message: "Fighters are not found.",
        success: false,
      });
    }
    return res.status(200).json({
      fighters,
      success: true,
    });
  } catch (err) {
    return res.status(400).json({
      err,
      success: false,
    });
  }
};
