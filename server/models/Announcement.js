const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  body:      { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pinned:    { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Announcement", announcementSchema);
