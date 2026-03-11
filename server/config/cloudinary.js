const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for players and hall of fame photos
const playerStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "skyliners/players",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, crop: "limit" }],
  },
});

// Storage for gallery photos
const galleryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "skyliners/gallery",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1200, crop: "limit" }],
  },
});

// Storage for hall of fame
const hofStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "skyliners/hof",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, crop: "limit" }],
  },
});

const uploadPlayer = multer({ storage: playerStorage });
const uploadGallery = multer({ storage: galleryStorage });
const uploadHof = multer({ storage: hofStorage });

module.exports = { cloudinary, uploadPlayer, uploadGallery, uploadHof };
