const mongoose = require("mongoose");
const FighterAndClub = require("../models/FighterAndClub");
const ClubSchema = require("../models/Club");

const FighterSchema = new mongoose.Schema({
  profile_url: {
    type: String,
  },

  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
    maxLength: [50, "Name cannot be more than 50 characters."],
  },
  nick_name: {
    type: String,
    trim: true,
    maxLength: [50, "Nickname cannot be more than 50 characters."],
  },
  status: {
    type: String,
  },
  division: {
    type: String,
  },
  hometown: {
    type: String,
  },
  trains_at: {
    //! Bunu club olarak ayri bir Model olarak al dedi
    /*
    type: mongoose.Schema.ObjectId,
    ref: "Club",
    required: true,
    */
    type: String,
    default: "None",
  },
  fighting_style: {
    type: String,
  },
  age: {
    type: Number,
  },
  height: {
    type: Number,
  },
  weight: {
    type: String,
  },
  octagon_debut: {
    type: Date,
  },
  reach: {
    type: Number,
  },
  leg_reach: {
    type: Number,
  },
  records: {
    record: { type: String },
  },
  fighter_stats: {
    sig_striker_defense: { type: Number },
    takedown_defense: { type: Number },
    avg_fight_time: { type: String },
    strinking_stats: {
      sig_strikes_landed_per_min: { type: Number },
      sig_strikes_absorbed_per_min: { type: Number },
      sig_str_by_position: {
        standing: { type: Number },
        clinch: { type: Number },
        ground: { type: Number },
      },
      sig_str_by_target: {
        head: { type: Number },
        body: { type: Number },
        leg: { type: Number },
      },
    },
    grappling_stats: {
      takedowns_avg_per_15_min: { type: Number },
      submission_avg_per_15_min: { type: Number },
    },
    win_by_way: {
      ko_tko: { type: Number },
      dec: { type: Number },
      sub: { type: Number },
    },
  },
});

module.exports = mongoose.model("Fighter", FighterSchema);
