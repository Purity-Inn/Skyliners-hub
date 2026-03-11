const cloudinary = require("../config/cloudinary");

const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    return res.status(200).json({
      message: "Photo uploaded successfully",
      url: req.file.path,
      publicId: req.file.filename,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deletePhoto = async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({ message: "Public ID required" });
    }

    await cloudinary.uploader.destroy(publicId);

    return res.json({ message: "Photo deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { uploadPhoto, deletePhoto };
