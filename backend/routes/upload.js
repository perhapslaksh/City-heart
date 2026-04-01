const router = require('express').Router();
const multer = require('multer');
const { auth } = require('../middleware/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
  fileFilter: (req, file, cb) => {
    ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Only JPEG, PNG, WebP allowed'));
  },
});

// POST /api/upload/photos
router.post('/photos', auth, upload.array('photos', 5), async (req, res) => {
  try {
    if (!req.files?.length) return res.status(400).json({ message: 'No files uploaded' });
    // Returns base64 data URLs for dev. For production, swap in Cloudinary:
    // const cloudinary = require('cloudinary').v2;
    // const result = await cloudinary.uploader.upload(dataUri, { folder: 'cityheart' });
    // urls.push(result.secure_url);
    const urls = req.files.map(f => `data:${f.mimetype};base64,${f.buffer.toString('base64')}`);
    res.json({ urls });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/upload/avatar
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const url = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    res.json({ url });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
