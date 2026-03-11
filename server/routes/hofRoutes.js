const router = require("express").Router();
const HallOfFame = require("../models/HallOfFame");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const { uploadHof, cloudinary } = require("../config/cloudinary");

router.get("/", async (req, res) => {
  const hof = await HallOfFame.find().sort({ createdAt: -1 });
  res.json(hof);
});

router.post("/", protect, requireRole("admin"), uploadHof.single("photo"), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.photo = req.file.path;
    if (data.achievements && typeof data.achievements === "string") {
      data.achievements = data.achievements.split(",").map((a) => a.trim()).filter(Boolean);
    }
    const entry = await HallOfFame.create(data);
    res.status(201).json(entry);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put("/:id", protect, requireRole("admin"), uploadHof.single("photo"), async (req, res) => {
  try {
    const entry = await HallOfFame.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Not found" });
    const data = { ...req.body };
    if (req.file) {
      if (entry.photo) {
        const publicId = entry.photo.split("/").slice(-2).join("/").split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
      data.photo = req.file.path;
    }
    if (data.achievements && typeof data.achievements === "string") {
      data.achievements = data.achievements.split(",").map((a) => a.trim()).filter(Boolean);
    }
    const updated = await HallOfFame.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete("/:id", protect, requireRole("admin"), async (req, res) => {
  try {
    const entry = await HallOfFame.findById(req.params.id);
    if (entry?.photo) {
      const publicId = entry.photo.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }
    await HallOfFame.findByIdAndDelete(req.params.id);
    res.json({ message: "Entry deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
