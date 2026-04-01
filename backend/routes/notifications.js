const router = require('express').Router();
const Notification = require('../models/Notification');
const { auth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'username displayName avatar')
      .sort('-createdAt').limit(30);
    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, read: false });
    res.json({ notifications, unreadCount });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true });
    res.json({ message: 'All read' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
