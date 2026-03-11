const router = require("express").Router();
const {
  getMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch,
} = require("../controllers/matchController");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.get("/", getMatches);
router.get("/:id", getMatch);
router.post("/", protect, requireRole("admin"), createMatch);
router.put("/:id", protect, requireRole("admin"), updateMatch);
router.delete("/:id", protect, requireRole("admin"), deleteMatch);

module.exports = router;