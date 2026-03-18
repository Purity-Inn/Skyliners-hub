const express = require('express');
const { testNotification } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/notifications/test - Admin only test notification
router.post('/test', protect, testNotification);

module.exports = router;
