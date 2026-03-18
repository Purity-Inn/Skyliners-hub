const { notifyMembers } = require('../services/notificationService');
const User = require('../models/User');

const testNotification = async (req, res) => {
  try {
    // Only admins can test notifications
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can test notifications' });
    }

    // Send test notification
    await notifyMembers({
      subject: '🧪 Skyliners Hub Test Notification',
      text: 'This is a test email from the admin panel. If you received this, notifications are working!',
      html: `<h2>🧪 Test Notification</h2><p>This is a test email from the Skyliners Hub admin panel.</p><p><strong>If you received this, notifications are working correctly!</strong></p>`,
    });

    // Get count of recipients
    const members = await User.countDocuments({ role: { $in: ['member', 'admin'] } });

    res.json({
      success: true,
      message: `Test notification sent to ${members} member(s)/admin(s)`,
      recipientCount: members,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { testNotification };
