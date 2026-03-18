const Match = require("../models/Match");
const { notifyMembers } = require("../services/notificationService");

const getMatches = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const matches = await Match.find(filter).sort({ date: -1 });
    res.json(matches);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: "Match not found" });
    res.json(match);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const createMatch = async (req, res) => {
  try {
    const match = await Match.create(req.body);

    await notifyMembers({
      subject: "New match added",
      text: `${match.teamA || "Skyliners"} vs ${match.teamB || match.opponent} on ${new Date(match.date).toDateString()} at ${match.venue}.`,
      html: `<p>New match added: <strong>${match.teamA || "Skyliners"} vs ${match.teamB || match.opponent}</strong></p><p>${new Date(match.date).toDateString()} · ${match.venue}</p>`,
    });

    res.status(201).json(match);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const updateMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!match) return res.status(404).json({ message: "Match not found" });

    await notifyMembers({
      subject: "Match updated",
      text: `Match updated: ${match.teamA || "Skyliners"} vs ${match.teamB || match.opponent}.`,
      html: `<p>Match updated: <strong>${match.teamA || "Skyliners"} vs ${match.teamB || match.opponent}</strong>.</p>`,
    });

    res.json(match);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteMatch = async (req, res) => {
  try {
    await Match.findByIdAndDelete(req.params.id);
    res.json({ message: "Match deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getMatches, getMatch, createMatch, updateMatch, deleteMatch };
