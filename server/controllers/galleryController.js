const GalleryPhoto = require("../models/GalleryPhoto");
const { cloudinary } = require("../config/cloudinary");
const { notifyMembers } = require("../services/notificationService");

const getPhotos = async (req, res) => {
  try {
    const filter = { isApproved: true };
    if (req.query.category) filter.category = req.query.category;
    const photos = await GalleryPhoto.find(filter)
      .populate("uploadedBy", "name")
      .sort({ createdAt: -1 });
    res.json(photos);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getPendingPhotos = async (req, res) => {
  try {
    const photos = await GalleryPhoto.find({ isApproved: false })
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });
    res.json(photos);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image provided" });
    const photo = await GalleryPhoto.create({
      imageUrl: req.file.path,
      publicId: req.file.filename,
      caption: req.body.caption || "",
      category: req.body.category || "other",
      uploadedBy: req.user._id,
      isApproved: req.user.role === "admin",
    });

    await notifyMembers({
      subject: req.user.role === "admin" ? "New gallery photo uploaded" : "New gallery photo submitted",
      text: req.user.role === "admin"
        ? "A new gallery photo has been uploaded and published."
        : "A new gallery photo has been submitted and is awaiting approval.",
      html: req.user.role === "admin"
        ? "<p>A new gallery photo has been uploaded and published.</p>"
        : "<p>A new gallery photo has been submitted and is awaiting approval.</p>",
    });

    res.status(201).json(photo);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const approvePhoto = async (req, res) => {
  try {
    const photo = await GalleryPhoto.findByIdAndUpdate(
      req.params.id, { isApproved: true }, { new: true }
    );
    if (!photo) return res.status(404).json({ message: "Photo not found" });

    await notifyMembers({
      subject: "Gallery photo approved",
      text: "A gallery photo has been approved and is now visible to everyone.",
      html: "<p>A gallery photo has been approved and is now visible to everyone.</p>",
    });

    res.json(photo);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deletePhoto = async (req, res) => {
  try {
    const photo = await GalleryPhoto.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: "Photo not found" });
    await cloudinary.uploader.destroy(photo.publicId);
    await photo.deleteOne();
    res.json({ message: "Photo deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getPhotos, getPendingPhotos, uploadPhoto, approvePhoto, deletePhoto };
