const mongoose = require("mongoose");

const leadershipSchema = new mongoose.Schema(
  {
    key: { type: String, default: "default", unique: true, index: true },
    coach: { type: String, default: "To Be Announced", trim: true },
    menCaptain: { type: String, default: "To Be Announced", trim: true },
    womenCaptain: { type: String, default: "To Be Announced", trim: true },
    menViceCaptain: { type: String, default: "To Be Announced", trim: true },
    treasurer: { type: String, default: "To Be Announced", trim: true },
    socialMediaManager: { type: String, default: "To Be Announced", trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leadership", leadershipSchema);
