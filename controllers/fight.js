const mongoose = require("mongoose");
const express = require("express");
const Fight = require("../models/Fight");
const FighterAndFight = require("../models/FighterAndFight");
const Fighter = require("../models/Fighter");

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
      return res.status(400).json({
        success: false,
        message: "Page number cannot be zero.",
      });
    }

    const fights = await Fight.find()
      .skip((page - 1) * count)
      .limit(count);

    if (!fights) {
      return res.status(400).json({
        success: false,
        error: "No fight is found.",
      });
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
    res.status(404).json({
      success: false,
    });
  }
};

//* Get A Fighter
exports.getFight = async (req, res, next) => {
  try {
    const fight = await Fight.findById(req.params.id);

    if (!fight) {
      return res.status(400).json({
        success: false,
        error: "No fight is found.",
      });
    }

    res.status(200).json({
      success: true,
      fight,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
    });
  }
};

//* Add a fighter
exports.addFight = async (req, res, next) => {
  try {
    const fight = await Fight.create(req.body);
    res.status(201).json({
      success: true,
      fight,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
    });
  }
};

//* Update a fighter
exports.updateFight = async (req, res, next) => {
  try {
    const fight = await Fight.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!fight) {
      return res.status(400).json({
        success: false,
        error: "No fight is found.",
      });
    }

    res.status(200).json({
      success: true,
      fight,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
    });
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
    return res.status(400).json({
      success: false,
      error: err,
    });
  }
};
