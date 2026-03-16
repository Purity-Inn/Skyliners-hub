const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  teamA:        { type: String, trim: true, default: "Skyliners" },
  teamB:        { type: String, trim: true },
  opponent:    { type: String, required: true },
  date:        { type: Date, required: true },
  venue:       { type: String, required: true },
  competition: { type: String, default: "Friendly" },
  status:      { type: String, enum: ["upcoming", "completed", "cancelled"], default: "upcoming" },
  result: {
    skylinerScore: { type: Number, default: null },
    opponentScore: { type: Number, default: null },
    outcome: { type: String, enum: ["win", "loss", "draw", null], default: null },
  },
  notes: { type: String, default: "" },
}, { timestamps: true });

matchSchema.pre("validate", function syncTeams() {
  if (!this.teamA) this.teamA = "Skyliners";
  if (!this.teamB && this.opponent) this.teamB = this.opponent;
  if (!this.opponent && this.teamB) this.opponent = this.teamB;
});

module.exports = mongoose.model("Match", matchSchema);
