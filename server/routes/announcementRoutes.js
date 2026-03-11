const router = require("express").Router();
const {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcementController");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.get("/", getAnnouncements);
router.post("/", protect, requireRole("admin"), createAnnouncement);
router.put("/:id", protect, requireRole("admin"), updateAnnouncement);
router.delete("/:id", protect, requireRole("admin"), deleteAnnouncement);

module.exports = router;