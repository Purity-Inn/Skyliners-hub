const router = require("express").Router();
const {
  register,
  login,
  getMe,
  getUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Logged in user
router.get("/me", protect, getMe);

// Admin only routes
router.get("/users", protect, requireRole("admin"), getUsers);
router.put("/users/:id/role", protect, requireRole("admin"), updateUserRole);
router.delete("/users/:id", protect, requireRole("admin"), deleteUser);

module.exports = router;
