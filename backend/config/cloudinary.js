const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({ cloudinary, params: {
  folder: 'camera-rental', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  transformation: [{ width: 800, height: 600, crop: 'limit' }],
} });
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 5 },
  fileFilter(req, file, callback) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      const error = new Error('Upload a JPG, PNG or WebP image.'); error.status = 415;
      return callback(error);
    }
    callback(null, true);
  },
});
module.exports = { cloudinary, upload };
