const router = require('express').Router();
const Place = require('../models/Place');
const Bookmark = require('../models/Bookmark');
const List = require('../models/List');

router.get('/', async (req, res) => {
  try {
    const cities = await Place.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $match: { _id: { $ne: null, $ne: '' } } },
      { $sort: { count: -1 } }, { $limit: 50 }
    ]);
    res.json(cities);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/:city', async (req, res) => {
  try {
    const city = decodeURIComponent(req.params.city);
    const cityFilter = { city: { $regex: `^${city}$`, $options: 'i' } };

    const trendingPlaces = await Place.find(cityFilter).sort({ bookmarkCount: -1, averageRating: -1 }).limit(12);

    const recentReviews = await Bookmark.find({ 'review.text': { $exists: true }, isPublic: true })
      .populate('user', 'username displayName avatar')
      .populate({ path: 'place', match: cityFilter })
      .sort('-createdAt').limit(30)
      .then(r => r.filter(b => b.place));

    const topLists = await List.find({ isPublic: true })
      .populate({ path: 'places', match: cityFilter })
      .populate('user', 'username displayName avatar')
      .sort('-likeCount').limit(20)
      .then(r => r.filter(l => l.places.length > 0));

    res.json({ city, trendingPlaces, recentReviews, topLists });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
