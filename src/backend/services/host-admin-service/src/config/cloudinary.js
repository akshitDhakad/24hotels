const cloudinary = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const { getEnv } = require('./env');
const { AppError } = require('../utils/AppError');

function configureCloudinary() {
  const env = getEnv();
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
}

function createRoomImageUpload() {
  configureCloudinary();
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'hotel-rooms',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      resource_type: 'image',
    },
  });

  return multer({
    storage,
    limits: { files: 10, fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype || !file.mimetype.startsWith('image/')) {
        return cb(new AppError(400, 'Only image/* uploads are allowed'));
      }
      return cb(null, true);
    },
  });
}

module.exports = { cloudinary, configureCloudinary, createRoomImageUpload };
