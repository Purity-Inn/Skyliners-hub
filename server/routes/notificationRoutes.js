const express = require('express');
const { testNotification } = require('../controllers/notificationController');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/notifications/test - Admin only test notification
router.post('/test', auth, testNotification);

module.exports = router;
