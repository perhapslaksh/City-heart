// routes/feed.js
const router = require('express').Router();
const Bookmark = require('../models/Bookmark');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const { mode = 'following', page = 1 } = req.query;
    const me = await User.findById(req.user._id);
    const query = { isPublic: true };
    if (mode === 'following') query.user = { $in: [...me.following, me._id] };
    const feed = await Bookmark.find(query)
      .populate('user', 'username displayName avatar')
      .populate('place')
      .sort('-createdAt').skip((page - 1) * 20).limit(20);
    res.json(feed);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
