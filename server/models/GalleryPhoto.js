const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  imageUrl:   { type: String, required: true },
  publicId:   { type: String, required: true },
  caption:    { type: String, default: "" },
  category:   { type: String, enum: ["match", "training", "event", "other"], default: "other" },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isApproved: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("GalleryPhoto", gallerySchema);
