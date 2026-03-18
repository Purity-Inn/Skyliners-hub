const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { cloudinary } = require("../config/cloudinary");
const { notifyMembers } = require("../services/notificationService");

const getTokenExpiry = () => {
  const rawValue = process.env.JWT_EXPIRES_IN;

  if (!rawValue) return "7d";

  const normalizedValue = String(rawValue).trim().replace(/^['"]|['"]$/g, "");

  if (/^\d+$/.test(normalizedValue)) {
    return Number(normalizedValue);
  }

  return normalizedValue;
};

const generateToken = (id) => {
  const expiresIn = getTokenExpiry();

  try {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
  } catch (error) {
    try {
      return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    } catch (fallbackError) {
      return jwt.sign({ id }, process.env.JWT_SECRET);
    }
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already registered" });
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? "admin" : "visitor";
    const user = await User.create({ name, email, password, role });

    await notifyMembers({
      subject: "New user joined Skyliners Hub",
      text: `${user.name} just joined as a ${user.role}.`,
      html: `<p><strong>${user.name}</strong> just joined Skyliners Hub as a <strong>${user.role}</strong>.</p>`,
    });

    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, profilePhoto: user.profilePhoto,
      token: generateToken(user._id),
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid email or password" });
    res.json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, profilePhoto: user.profilePhoto,
      token: generateToken(user._id),
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getMe = async (req, res) => res.json(req.user);

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["visitor", "member", "admin"].includes(role))
      return res.status(400).json({ message: "Invalid role" });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: `Role updated to ${role}`, user });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc    Update own profile (name + photo)
// @route   PUT /api/auth/profile
// @access  Private (any logged in user)
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update name if provided
    if (req.body.name) user.name = req.body.name;

    // If new photo uploaded
    if (req.file) {
      // Delete old photo from Cloudinary if exists
      if (user.profilePhoto) {
        const publicId = user.profilePhoto.split("/").slice(-2).join("/").split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
      user.profilePhoto = req.file.path;
    }

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePhoto: user.profilePhoto,
      token: generateToken(user._id),
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { register, login, getMe, getUsers, updateUserRole, deleteUser, updateProfile };
