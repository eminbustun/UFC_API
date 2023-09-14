const mongoose = require("mongoose");

const FightSchema = new mongoose.Schema({
  event: {
    type: String,
  },
  date: {
    type: Date,
  },
  location: {
    type: String,
  },
  fighter1: {
    type: String,
  },
  fighter2: {
    type: String,
  },
  win: {
    type: String,
  },
  lose: {
    type: String,
  },
  draw1: {
    type: String,
  },
  draw2: {
    type: String,
  },
  nc1: {
    type: String,
  },
  nc2: {
    type: String,
  },
  weight_class: {
    type: String,
  },
  method: {
    type: String,
  },
  endWith: {
    type: String,
  },
  roundd: {
    type: String,
  },
  time: {
    type: String,
  },
});

module.exports = mongoose.model("Fight", FightSchema);
