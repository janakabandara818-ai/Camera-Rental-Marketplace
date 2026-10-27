const express = require('express');
const router = express.Router();
const { upload, cloudinary } = require('../config/cloudinary');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, adminOnly, (req, res) => {
  upload.single('image')(req, res, error => {
    if (error) {
      const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : error.status || (error.name === 'MulterError' ? 400 : 503);
      const message = status === 413 ? 'Image must be 5 MB or smaller.' : status === 415 ? 'Upload a JPG, PNG or WebP image.' : 'Unable to upload image. Check the file and upload configuration.';
      return res.status(status).json({ message });
    }
    if (!req.file) return res.status(400).json({ message: 'Choose an image to upload.' });
    res.json({ url: req.file.path, public_id: req.file.filename });
  });
});

router.delete('/:public_id', protect, adminOnly, async (req, res) => {
  if (!/^camera-rental\/[a-zA-Z0-9_-]+$/.test(req.params.public_id)) return res.status(400).json({ message: 'Invalid product image ID.' });
  try {
    const result = await cloudinary.uploader.destroy(req.params.public_id);
    res.json({ message: result.result === 'not found' ? 'Image already removed.' : 'Image deleted.' });
  } catch { res.status(503).json({ message: 'Unable to delete image. Please try again.' }); }
});

module.exports = router;
