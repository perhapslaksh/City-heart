const router = require('express').Router();
const List = require('../models/List');
const { auth, optionalAuth } = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try { res.status(201).json(await List.create({ ...req.body, user: req.user._id })); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const list = await List.findById(req.params.id).populate('places').populate('user', 'username displayName avatar');
    if (!list) return res.status(404).json({ message: 'Not found' });
    res.json(list);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const list = await List.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
    if (!list) return res.status(404).json({ message: 'Not found' });
    res.json(list);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try { await List.findOneAndDelete({ _id: req.params.id, user: req.user._id }); res.json({ message: 'Deleted' }); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/:id/places', auth, async (req, res) => {
  try {
    const list = await List.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { $addToSet: { places: req.body.placeId } }, { new: true });
    res.json(list);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete('/:id/places/:placeId', auth, async (req, res) => {
  try {
    const list = await List.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { $pull: { places: req.params.placeId } }, { new: true });
    res.json(list);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
