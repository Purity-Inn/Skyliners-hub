const Announcement = require("../models/Announcement");
const { notifyMembers } = require("../services/notificationService");

const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("createdBy", "name")
      .sort({ pinned: -1, createdAt: -1 });
    res.json(announcements);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const createAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.create({ ...req.body, createdBy: req.user._id });

    await notifyMembers({
      subject: `New announcement: ${announcement.title}`,
      text: announcement.body,
      html: `<h3>${announcement.title}</h3><p>${announcement.body}</p>`,
    });

    res.status(201).json(announcement);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (announcement) {
      await notifyMembers({
        subject: `Announcement updated: ${announcement.title}`,
        text: announcement.body,
        html: `<h3>${announcement.title}</h3><p>${announcement.body}</p>`,
      });
    }

    res.json(announcement);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: "Announcement deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement };
