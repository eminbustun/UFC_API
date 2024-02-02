const mongoose = require("mongoose");

const FighterAndFightSchema = new mongoose.Schema({
  fighter1ID: {
    type: mongoose.Schema.ObjectId,
    ref: "Fighter",
  },

  fighter2ID: {
    type: mongoose.Schema.ObjectId,
    ref: "Fighter",
  },
  fight: {
    type: mongoose.Schema.ObjectId,
    ref: "Fight",
  },
});

module.exports = mongoose.model("FighterAndFight", FighterAndFightSchema);
