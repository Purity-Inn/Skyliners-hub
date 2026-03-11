const Player = require("../models/Player");
const { cloudinary } = require("../config/cloudinary");

const getPlayers = async (req, res) => {
  try {
    const players = await Player.find({ isActive: true }).sort("jerseyNumber");
    res.json(players);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getPlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: "Player not found" });
    res.json(player);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const createPlayer = async (req, res) => {
  try {
    const data = { ...req.body };

    // If photo was uploaded via multer/cloudinary
    if (req.file) {
      data.photo = req.file.path;
    }

    // Parse achievements from comma string to array
    if (data.achievements && typeof data.achievements === "string") {
      data.achievements = data.achievements.split(",").map((a) => a.trim()).filter(Boolean);
    }

    const player = await Player.create(data);
    res.status(201).json(player);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const updatePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: "Player not found" });

    const data = { ...req.body };

    // If new photo uploaded, delete old one from Cloudinary
    if (req.file) {
      if (player.photo) {
        const publicId = player.photo.split("/").slice(-2).join("/").split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
      data.photo = req.file.path;
    }

    if (data.achievements && typeof data.achievements === "string") {
      data.achievements = data.achievements.split(",").map((a) => a.trim()).filter(Boolean);
    }

    const updated = await Player.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: "Player not found" });

    // Delete photo from Cloudinary
    if (player.photo) {
      const publicId = player.photo.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await player.deleteOne();
    res.json({ message: "Player deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getUpcomingBirthdays = async (req, res) => {
  try {
    const today = new Date();
    const players = await Player.find({ isActive: true, dateOfBirth: { $exists: true } });

    const upcoming = players.filter((p) => {
      const bday = new Date(p.dateOfBirth);
      const next = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());
      if (next < today) next.setFullYear(today.getFullYear() + 1);
      const diff = (next - today) / (1000 * 60 * 60 * 24);
      return diff <= 30;
    }).sort((a, b) => {
      const getNext = (d) => {
        const bday = new Date(d.dateOfBirth);
        const next = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());
        if (next < today) next.setFullYear(today.getFullYear() + 1);
        return next;
      };
      return getNext(a) - getNext(b);
    });

    res.json(upcoming);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getPlayers, getPlayer, createPlayer, updatePlayer, deletePlayer, getUpcomingBirthdays };
