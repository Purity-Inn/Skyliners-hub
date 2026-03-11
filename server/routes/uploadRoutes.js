const router = require("express").Router();
const upload = require("../middleware/uploadMiddleware");
const { uploadPhoto, deletePhoto } = require("../controllers/uploadController");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.post("/", protect, upload.single("image"), uploadPhoto);
router.delete("/", protect, requireRole("admin"), deletePhoto);

module.exports = router;
