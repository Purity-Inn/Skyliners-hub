const router = require("express").Router();
const {
  register, login, getMe, getUsers,
  updateUserRole, deleteUser, updateProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const { uploadPlayer } = require("../config/cloudinary");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/profile", protect, uploadPlayer.single("profilePhoto"), updateProfile);
router.get("/users", protect, requireRole("admin"), getUsers);
router.put("/users/:id/role", protect, requireRole("admin"), updateUserRole);
router.delete("/users/:id", protect, requireRole("admin"), deleteUser);

module.exports = router;
