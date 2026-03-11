const Match = require("../models/Match");

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
    res.status(201).json(match);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const updateMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!match) return res.status(404).json({ message: "Match not found" });
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
