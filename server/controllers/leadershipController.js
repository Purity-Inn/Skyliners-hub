const Leadership = require("../models/Leadership");

const defaultLeadership = {
  coach: "To Be Announced",
  menCaptain: "To Be Announced",
  womenCaptain: "To Be Announced",
  menViceCaptain: "To Be Announced",
  treasurer: "To Be Announced",
  socialMediaManager: "To Be Announced",
};

const sanitize = (value) => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || "To Be Announced";
};

const getLeadership = async (req, res) => {
  try {
    let leadership = await Leadership.findOne({ key: "default" }).lean();

    if (!leadership) {
      leadership = await Leadership.create({ key: "default", ...defaultLeadership });
      leadership = leadership.toObject();
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
      menCaptain: sanitize(req.body.menCaptain),
      womenCaptain: sanitize(req.body.womenCaptain),
      menViceCaptain: sanitize(req.body.menViceCaptain),
      treasurer: sanitize(req.body.treasurer),
      socialMediaManager: sanitize(req.body.socialMediaManager),
    };

    const payload = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined)
    );

    const leadership = await Leadership.findOneAndUpdate(
      { key: "default" },
      { $set: payload },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(leadership);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getLeadership, updateLeadership };
