const mongoose = require("mongoose");

const hofSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  photo:        { type: String, default: "" },
  position:     { type: String },
  yearsActive:  { type: String },
  achievements: [String],
  tribute:      { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("HallOfFame", hofSchema);
