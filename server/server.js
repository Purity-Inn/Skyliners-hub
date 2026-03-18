const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

console.log("[server] Bootstrapping...");

dotenv.config();
console.log("[server] Env loaded");
connectDB();
console.log("[server] DB connect invoked");

const app = express();

const normalizeOrigin = (value) => (value || "").replace(/\/$/, "");
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
]
  .filter(Boolean)
  .map(normalizeOrigin);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = normalizeOrigin(origin);
      const isAllowed = allowedOrigins.includes(normalizedOrigin);
      const isVercelPreview = /\.vercel\.app$/.test(new URL(normalizedOrigin).hostname);

      if (isAllowed || isVercelPreview) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require("./routes/authRoutes");
const playerRoutes = require("./routes/playerRoutes");
const matchRoutes = require("./routes/matchRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const hofRoutes = require("./routes/hofRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

console.log("[server] Route types:", {
  authRoutes: typeof authRoutes,
  playerRoutes: typeof playerRoutes,
  matchRoutes: typeof matchRoutes,
  galleryRoutes: typeof galleryRoutes,
  hofRoutes: typeof hofRoutes,
  announcementRoutes: typeof announcementRoutes,
  uploadRoutes: typeof uploadRoutes,
  notificationRoutes: typeof notificationRoutes,
});

app.use("/api/auth", authRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/hof", hofRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.json({ message: "🏆 Skyliners Hub backend is live" });
});

app.get("/api", (req, res) => {
  res.json({ message: "🏆 Skyliners Hub API is running!" });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error("[error]", err);
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
console.log("[server] Listen call registered");