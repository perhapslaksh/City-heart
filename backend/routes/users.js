const router = require('express').Router();
const User = require('../models/User');
const Bookmark = require('../models/Bookmark');
const List = require('../models/List');
const { auth, optionalAuth } = require('../middleware/auth');

router.get('/search', async (req, res) => {
  try {
    const users = await User.find({ $or: [{ username: { $regex: req.query.q, $options: 'i' } }, { displayName: { $regex: req.query.q, $options: 'i' } }] }).select('username displayName avatar').limit(10);
    res.json(users);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/:username', optionalAuth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password -email -pendingFollowers');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const isOwner = req.user?._id.toString() === user._id.toString();
    const isFollowing = req.user ? user.followers.map(String).includes(req.user._id.toString()) : false;
    if (user.isPrivate && !isOwner && !isFollowing)
      return res.json({ user: { ...user.toObject(), hiddenProfile: true }, isOwner, isFollowing });
    res.json({ user, isOwner, isFollowing });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/me', auth, async (req, res) => {
  try {
    const { displayName, bio, avatar, isPrivate } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { displayName, bio, avatar, isPrivate }, { new: true }).select('-password');
    res.json({ user });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/:id/follow', auth, async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: 'User not found' });
    if (target._id.toString() === req.user._id.toString()) return res.status(400).json({ message: 'Cannot follow yourself' });
    if (target.followers.map(String).includes(req.user._id.toString())) return res.json({ status: 'already_following' });
    if (target.isPrivate) {
      await User.findByIdAndUpdate(req.params.id, { $addToSet: { pendingFollowers: req.user._id } });
      return res.json({ status: 'pending' });
    }
    await User.findByIdAndUpdate(req.params.id, { $addToSet: { followers: req.user._id } });
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { following: req.params.id } });
    res.json({ status: 'following' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete('/:id/follow', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { $pull: { followers: req.user._id } });
    await User.findByIdAndUpdate(req.user._id, { $pull: { following: req.params.id } });
    res.json({ status: 'unfollowed' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/:username/bookmarks', optionalAuth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'Not found' });
    const isOwner = req.user?._id.toString() === user._id.toString();
    const isFollowing = req.user ? user.followers.map(String).includes(req.user._id.toString()) : false;
    if (user.isPrivate && !isOwner && !isFollowing) return res.status(403).json({ message: 'Private account' });
    const bookmarks = await Bookmark.find({ user: user._id, ...(isOwner ? {} : { isPublic: true }) }).populate('place').sort('-createdAt').limit(200);
    res.json(bookmarks);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/:username/lists', optionalAuth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'Not found' });
    const isOwner = req.user?._id.toString() === user._id.toString();
    const lists = await List.find({ user: user._id, ...(isOwner ? {} : { isPublic: true }) }).populate('places').sort('-createdAt');
    res.json(lists);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
