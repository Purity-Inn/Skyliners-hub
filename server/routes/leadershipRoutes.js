const router = require("express").Router();
const { getLeadership, updateLeadership } = require("../controllers/leadershipController");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.get("/", getLeadership);
router.put("/", protect, requireRole("admin"), updateLeadership);

module.exports = router;
