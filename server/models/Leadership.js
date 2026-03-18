const mongoose = require("mongoose");

const leadershipSchema = new mongoose.Schema(
  {
    key: { type: String, default: "default", unique: true, index: true },
    coach: { type: String, default: "To Be Announced", trim: true },
    coachPlayer: { type: mongoose.Schema.Types.ObjectId, ref: "Player", default: null },
    menCaptain: { type: String, default: "To Be Announced", trim: true },
    menCaptainPlayer: { type: mongoose.Schema.Types.ObjectId, ref: "Player", default: null },
    womenCaptain: { type: String, default: "To Be Announced", trim: true },
    womenCaptainPlayer: { type: mongoose.Schema.Types.ObjectId, ref: "Player", default: null },
    menViceCaptain: { type: String, default: "To Be Announced", trim: true },
    menViceCaptainPlayer: { type: mongoose.Schema.Types.ObjectId, ref: "Player", default: null },
    treasurer: { type: String, default: "To Be Announced", trim: true },
    treasurerPlayer: { type: mongoose.Schema.Types.ObjectId, ref: "Player", default: null },
    socialMediaManager: { type: String, default: "To Be Announced", trim: true },
    socialMediaManagerPlayer: { type: mongoose.Schema.Types.ObjectId, ref: "Player", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leadership", leadershipSchema);
