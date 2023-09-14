const mongoose = require("mongoose");
const FighterSchema = require("../models/Fighter");

const FighterAndClubSchema = mongoose.Schema({
  fighter: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "Fighter",
  },
  club: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "Fighter",
  },
});

module.exports = mongoose.model("FighterAndClub", FighterAndClubSchema);
