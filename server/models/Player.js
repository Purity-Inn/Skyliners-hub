const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  jerseyNumber: { type: Number, required: true },
  position:     { type: String, required: true, trim: true },
  gender:       { 
    type: String, 
    required: true, 
    enum: ["Male", "Female"], 
    default: "Male" 
  },
  bio:          { type: String, default: "" },
  photo:        { type: String, default: "" },
  dateOfBirth:  { type: Date },
  yearJoined:   { type: Number },
  achievements: [String],
  isActive:     { type: Boolean, default: true },
}, { timestamps: true });

playerSchema.pre("validate", function normalizePosition() {
  if (!this.position) return;

  const normalized = String(this.position).trim();
  if (normalized.toLowerCase() === "zero") {
    this.position = "Left Wing";
  }
});

module.exports = mongoose.model("Player", playerSchema);
