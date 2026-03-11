const router = require("express").Router();
const {
  getPlayers, getPlayer, createPlayer,
  updatePlayer, deletePlayer, getUpcomingBirthdays,
} = require("../controllers/playerController");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const { uploadPlayer } = require("../config/cloudinary");

router.get("/", getPlayers);
router.get("/birthdays", getUpcomingBirthdays);
router.get("/:id", getPlayer);
router.post("/", protect, requireRole("admin"), uploadPlayer.single("photo"), createPlayer);
router.put("/:id", protect, requireRole("admin"), uploadPlayer.single("photo"), updatePlayer);
router.delete("/:id", protect, requireRole("admin"), deletePlayer);

module.exports = router;
