const router = require("express").Router();
const {
  getPhotos, getPendingPhotos, uploadPhoto, approvePhoto, deletePhoto,
} = require("../controllers/galleryController");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const { uploadGallery } = require("../config/cloudinary");

router.get("/", getPhotos);
router.get("/pending", protect, requireRole("admin"), getPendingPhotos);
router.post("/", protect, requireRole("admin", "member"), uploadGallery.single("image"), uploadPhoto);
router.patch("/:id/approve", protect, requireRole("admin"), approvePhoto);
router.delete("/:id", protect, requireRole("admin"), deletePhoto);

module.exports = router;
