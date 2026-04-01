const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const SECRET = process.env.JWT_SECRET || 'cityheart_dev_secret';

const sign = (id) => jwt.sign({ userId: id }, SECRET, { expiresIn: '30d' });
const cookieOpts = { httpOnly: true, maxAge: 30*24*60*60*1000, sameSite: 'lax' };

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, displayName } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: 'All fields required' });
    if (await User.findOne({ $or: [{ email }, { username }] }))
      return res.status(409).json({ message: 'Username or email already taken' });
    const user = await User.create({ username, email, password, displayName: displayName || username });
    const token = sign(user._id);
    res.cookie('token', token, cookieOpts);
    res.status(201).json({ user: user.toPublicJSON(), token });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    const user = await User.findOne({ $or: [{ email: emailOrUsername?.toLowerCase() }, { username: emailOrUsername }] });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    const token = sign(user._id);
    res.cookie('token', token, cookieOpts);
    res.json({ user: user.toPublicJSON(), token });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/logout', (req, res) => { res.clearCookie('token'); res.json({ message: 'Logged out' }); });

router.get('/me', auth, (req, res) => res.json({ user: req.user }));

module.exports = router;
