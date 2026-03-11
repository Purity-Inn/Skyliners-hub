const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  jerseyNumber: { type: Number, required: true, unique: true },
  position:     { 
    type: String, 
    required: true, 
    enum: ["Keeper", "Center", "Two", "Zero", "Captain", "Vice Captain"] 
  },
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

module.exports = mongoose.model("Player", playerSchema);
