const mongoose = require("mongoose");
const express = require("express");
const Fight = require("../models/Fight");
const FighterAndFight = require("../models/FighterAndFight");
const Fighter = require("../models/Fighter");
const ErrorResponse = require("../error/error-response");

exports.getFights = async (req, res, next) => {
  try {
    const totalFightCount = await Fight.count();
    const count = req.query.limit || 50;
    const page = req.query.page || 1;
    const name = req.query.name;
    const onlyWin = req.query.win;
    const onlyLose = req.query.lose;

    if (name) {
      if (onlyWin == "true") {
        const fights1 = await Fight.find({ fighter1: name });

        return res.status(200).json({
          success: true,
          length: fights1.length,
          fights: fights1,
        });
      } else if (onlyLose == "true") {
        const fights2 = await Fight.find({ fighter2: name });

        return res.status(200).json({
          success: true,
          length: fights2.length,
          fights: fights2,
        });
      } else {
        const fights1 = await Fight.find({ fighter1: name });
        const fights2 = await Fight.find({ fighter2: name });
        const all = [...fights1, ...fights2];
        return res.status(200).json({
          success: true,
          length: all.length,
          fights: all,
        });
      }
    }

    if (parseInt(page) === 0) {
      return next(new ErrorResponse("Page number cannot be zero.", 400));
    }

    const fights = await Fight.find()
      .skip((page - 1) * count)
      .limit(count);

    if (!fights || fights.length === 0) {
      return next("No fight is found.", 400);
    }

    var hasNextPage = count * page < totalFightCount;
    var hasPreviousPage = page > 1;
    var nextPage = +page + 1;
    var previousPage = page - 1;
    var lastPage = Math.ceil(totalFightCount / count);

    if (hasPreviousPage == false) {
      previousPage = undefined;
    }

    res.status(200).json({
      success: true,
      count: fights.length,
      fights,
      hasNextPage,
      hasPreviousPage,
      nextPage,
      previousPage,
      lastPage,
    });
  } catch (err) {
    console.log(err);
    next("An error occured while getting the fights.", 400);
  }
};

//* Get A Fight
exports.getFight = async (req, res, next) => {
  try {
    const fight = await Fight.findById(req.params.id);

    if (!fight) {
      return next(new ErrorResponse("No fight is found with this id.", 400));
    }

    res.status(200).json({
      success: true,
      fight,
    });
  } catch (err) {
    return next("An error occured while getting a specific fighter.", 400);
  }
};

//* Add a fight
exports.addFight = async (req, res, next) => {
  try {
    const fight = await Fight.create(req.body);
    res.status(201).json({
      success: true,
      fight,
    });
  } catch (err) {
    console.log(err);
    next("An error occured while adding a fight,", 400);
  }
};

//* Update a fight
exports.updateFight = async (req, res, next) => {
  try {
    const fight = await Fight.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!fight) {
      return next(new ErrorResponse("No fight is found with this id.", 400));
    }

    res.status(200).json({
      success: true,
      fight,
    });
  } catch (err) {
    console.log(err);
    next("An error occured while updating a fight.", 400);
  }
};

exports.addFightsAsAList = async (req, res, next) => {
  try {
    const fights = await Fight.create(req.body);

    for (let index = 0; index < fights.length; index++) {
      const fighter1 = await Fighter.findOne({ name: fights[index].fighter1 });
      const fighter2 = await Fighter.findOne({ name: fights[index].fighter2 });

      var firstFighterId;
      var secondFighterId;

      if (fighter1 && fighter2) {
        firstFighterId = fighter1.id;
        secondFighterId = fighter2.id;
      } else if (fighter1 && !fighter2) {
        firstFighterId = fighter1.id;
        const newFighter2 = await Fighter.create({
          name: fights[index].fighter2,
        });
        secondFighterId = newFighter2.id;
      } else if (!fighter1 && fighter2) {
        const newFighter1 = await Fighter.create({
          name: fights[index].fighter1,
        });
        firstFighterId = newFighter1.id;
        secondFighterId = fighter2;
      } else if (!fighter1 && !fighter2) {
        const newFighter1 = await Fighter.create({
          name: fights[index].fighter1,
        });
        firstFighterId = newFighter1.id;
        const newFighter2 = await Fighter.create({
          name: fights[index].fighter2,
        });
        secondFighterId = newFighter2.id;
      }
      await FighterAndFight.create({
        fighter1: firstFighterId,
        fighter2: secondFighterId,
        fight: fights[index].id,
      });
    }

    res.status(201).json({
      success: true,
      length: fights.length,
      fights,
    });
  } catch (err) {
    next("An error occured while adding fighters as a list.", 400);
  }
};
