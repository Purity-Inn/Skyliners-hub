const Leadership = require("../models/Leadership");
const mongoose = require("mongoose");

const defaultLeadership = {
  coach: "To Be Announced",
  coachPlayer: null,
  menCaptain: "To Be Announced",
  menCaptainPlayer: null,
  womenCaptain: "To Be Announced",
  womenCaptainPlayer: null,
  menViceCaptain: "To Be Announced",
  menViceCaptainPlayer: null,
  treasurer: "To Be Announced",
  treasurerPlayer: null,
  socialMediaManager: "To Be Announced",
  socialMediaManagerPlayer: null,
};

const populatePlayers = (query) =>
  query
    .populate("coachPlayer", "name photo position gender jerseyNumber")
    .populate("menCaptainPlayer", "name photo position gender jerseyNumber")
    .populate("womenCaptainPlayer", "name photo position gender jerseyNumber")
    .populate("menViceCaptainPlayer", "name photo position gender jerseyNumber")
    .populate("treasurerPlayer", "name photo position gender jerseyNumber")
    .populate("socialMediaManagerPlayer", "name photo position gender jerseyNumber");

const sanitize = (value) => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || "To Be Announced";
};

const sanitizePlayerId = (value) => {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  if (!mongoose.isValidObjectId(value)) return "INVALID";
  return value;
};

const getLeadership = async (req, res) => {
  try {
    let leadership = await populatePlayers(Leadership.findOne({ key: "default" })).lean();

    if (!leadership) {
      leadership = await Leadership.create({ key: "default", ...defaultLeadership });
      leadership = await populatePlayers(Leadership.findById(leadership._id)).lean();
    }

    res.json(leadership);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateLeadership = async (req, res) => {
  try {
    const updates = {
      coach: sanitize(req.body.coach),
      coachPlayer: sanitizePlayerId(req.body.coachPlayer),
      menCaptain: sanitize(req.body.menCaptain),
      menCaptainPlayer: sanitizePlayerId(req.body.menCaptainPlayer),
      womenCaptain: sanitize(req.body.womenCaptain),
      womenCaptainPlayer: sanitizePlayerId(req.body.womenCaptainPlayer),
      menViceCaptain: sanitize(req.body.menViceCaptain),
      menViceCaptainPlayer: sanitizePlayerId(req.body.menViceCaptainPlayer),
      treasurer: sanitize(req.body.treasurer),
      treasurerPlayer: sanitizePlayerId(req.body.treasurerPlayer),
      socialMediaManager: sanitize(req.body.socialMediaManager),
      socialMediaManagerPlayer: sanitizePlayerId(req.body.socialMediaManagerPlayer),
    };

    if (Object.values(updates).includes("INVALID")) {
      return res.status(400).json({ message: "Invalid player id in leadership payload" });
    }

    const payload = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined)
    );

    const leadership = await populatePlayers(
      Leadership.findOneAndUpdate(
        { key: "default" },
        { $set: payload },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      )
    );

    res.json(leadership);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getLeadership, updateLeadership };
