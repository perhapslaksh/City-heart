const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');
const Place = require('../models/Place');
const { auth, optionalAuth } = require('../middleware/auth');

// GET /api/reviews?place=&user=&tag=
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { place, user, tag, page = 1 } = req.query;
    const query = { 'review.text': { $exists: true }, isPublic: true };
    if (place) query.place = place;
    if (user) query.user = user;
    if (tag) query['review.tags'] = tag;

    const reviews = await Bookmark.find(query)
      .populate('user', 'username displayName avatar')
      .populate('place')
      .sort('-createdAt')
      .skip((page - 1) * 20)
      .limit(20);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/reviews/:bookmarkId — update review
router.put('/:bookmarkId', auth, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndUpdate(
      { _id: req.params.bookmarkId, user: req.user._id },
      { review: req.body.review },
      { new: true }
    );
    if (!bookmark) return res.status(404).json({ message: 'Not found' });

    // Recalc avg rating
    const bookmarks = await Bookmark.find({ place: bookmark.place, 'review.rating': { $exists: true } });
    if (bookmarks.length) {
      const avg = bookmarks.reduce((s, b) => s + b.review.rating, 0) / bookmarks.length;
      await Place.findByIdAndUpdate(bookmark.place, { averageRating: avg, reviewCount: bookmarks.length });
    }

    res.json(bookmark);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
