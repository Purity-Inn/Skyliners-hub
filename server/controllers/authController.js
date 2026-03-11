const jwt = require("jsonwebtoken");
const User = require("../models/User");

const getTokenExpiry = () => {
  const rawValue = process.env.JWT_EXPIRES_IN;

  if (!rawValue) {
    return "7d";
  }

  const normalizedValue = String(rawValue).trim().replace(/^['"]|['"]$/g, "");

  if (/^\d+$/.test(normalizedValue)) {
    return Number(normalizedValue);
  }

  return normalizedValue;
};

const generateToken = (id) => {
  const expiresIn = getTokenExpiry();
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
};

// @desc    Register a new user
// @route   POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (await User.findOne({ email })) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // First user to register becomes admin automatically
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? "admin" : "visitor";

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid email or password" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
const getMe = async (req, res, next) => {
  res.json(req.user);
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Admin only
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update user role
// @route   PUT /api/auth/users/:id/role
// @access  Admin only
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!["visitor", "member", "admin"].includes(role))
      return res.status(400).json({ message: "Invalid role. Must be visitor, member or admin" });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: `Role updated to ${role}`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/auth/users/:id
// @access  Admin only
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, getMe, getUsers, updateUserRole, deleteUser };
