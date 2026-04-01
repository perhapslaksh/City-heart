const router = require('express').Router();
const Place = require('../models/Place');
const Bookmark = require('../models/Bookmark');
const { auth, optionalAuth } = require('../middleware/auth');

router.get('/search', async (req, res) => {
  try {
    const { q, city } = req.query;
    const query = {};
    if (q) query.$text = { $search: q };
    if (city) query.city = { $regex: city, $options: 'i' };
    res.json(await Place.find(query).limit(20));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { mapboxId, name, address, city, country, coordinates, category } = req.body;
    let place = mapboxId ? await Place.findOne({ mapboxId }) : null;
    if (!place) place = await Place.create({ mapboxId, name, address, city, country, coordinates, category });
    res.json(place);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: 'Not found' });
    const userBookmark = req.user ? await Bookmark.findOne({ user: req.user._id, place: place._id }) : null;
    const reviews = await Bookmark.find({ place: place._id, 'review.text': { $exists: true }, isPublic: true })
      .populate('user', 'username displayName avatar').sort('-createdAt').limit(10);
    res.json({ place, userBookmark, reviews });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/:id/bookmark', auth, async (req, res) => {
  try {
    const { type, review, note, isPublic } = req.body;
    let bookmark = await Bookmark.findOne({ user: req.user._id, place: req.params.id });
    if (bookmark) {
      if (type) bookmark.type = type;
      if (review) bookmark.review = review;
      if (note !== undefined) bookmark.note = note;
      if (isPublic !== undefined) bookmark.isPublic = isPublic;
      await bookmark.save();
    } else {
      bookmark = await Bookmark.create({ user: req.user._id, place: req.params.id, type: type || 'bookmark', review, note, isPublic: isPublic ?? true });
      await Place.findByIdAndUpdate(req.params.id, { $inc: { bookmarkCount: 1 } });
    }
    if (review?.rating) {
      const all = await Bookmark.find({ place: req.params.id, 'review.rating': { $exists: true } });
      const avg = all.reduce((s, b) => s + b.review.rating, 0) / all.length;
      await Place.findByIdAndUpdate(req.params.id, { averageRating: Math.round(avg * 10) / 10, reviewCount: all.length });
    }
    res.json(bookmark);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete('/:id/bookmark', auth, async (req, res) => {
  try {
    await Bookmark.findOneAndDelete({ user: req.user._id, place: req.params.id });
    await Place.findByIdAndUpdate(req.params.id, { $inc: { bookmarkCount: -1 } });
    res.json({ message: 'Removed' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
