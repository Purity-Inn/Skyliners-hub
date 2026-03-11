const GalleryPhoto = require("../models/GalleryPhoto");
const { cloudinary } = require("../config/cloudinary");

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
    res.status(201).json(photo);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const approvePhoto = async (req, res) => {
  try {
    const photo = await GalleryPhoto.findByIdAndUpdate(
      req.params.id, { isApproved: true }, { new: true }
    );
    if (!photo) return res.status(404).json({ message: "Photo not found" });
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
