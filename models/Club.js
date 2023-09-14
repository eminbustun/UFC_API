const mongoose = require("mongoose");

const ClubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a club name."],
    trim: true,
  },
});

module.exports = mongoose.model("Club", ClubSchema);
