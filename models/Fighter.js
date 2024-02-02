const mongoose = require("mongoose");

const FighterSchema = new mongoose.Schema({
  fighter_id: {
    type: String,
  },

  name: {
    type: String,
  },

  height: {
    type: String,
  },
  weight: {
    type: String,
  },
  reach: {
    type: String,
  },
  stance: {
    type: String,
  },
  dob: {
    type: String,
  },
  n_win: {
    type: Number,
  },
  n_loss: {
    type: Number,
  },
  n_draw: {
    type: Number,
  },

  sig_str_land_pM: {
    type: Number,
  },
  sig_str_land_pct: {
    type: Number,
  },
  sig_str_abs_pM: {
    type: Number,
  },
  sig_str_def_pct: {
    type: Number,
  },
  td_avg: {
    type: Number,
  },
  td_land_pct: {
    type: Number,
  },
  td_def_pct: {
    type: Number,
  },
  sub_avg: {
    type: Number,
  },
});

module.exports = mongoose.model("Fighter", FighterSchema);
