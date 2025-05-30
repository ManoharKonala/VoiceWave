const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create storage engine for audio files
const audioStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'voicewave/audios',
    resource_type: 'video', // Using 'video' type for audio files
    format: async (req, file) => 'mp3', // Convert all uploads to mp3
    public_id: (req, file) => {
      // Create a unique name for the file
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      return 'audio-' + uniqueSuffix;
    },
  },
});

// Create storage engine for avatar images
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'voicewave/avatars',
    format: async (req, file) => 'jpg',
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      return 'avatar-' + uniqueSuffix;
    },
  },
});

// File filter for audio files
const audioFilter = (req, file, cb) => {
  // Accept audio files only
  if (!file.mimetype.match(/audio\/(mpeg|mp3|wav|m4a|ogg|aac)/)) {
    return cb(new Error('Only audio files are allowed!'), false);
  }
  cb(null, true);
};

// File filter for images
const imageFilter = (req, file, cb) => {
  if (!file.mimetype.match(/image\/(jpeg|jpg|png|gif)/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Multer upload instances
const uploadAudio = multer({
  storage: audioStorage,
  fileFilter: audioFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for audio files
  },
});

const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit for avatar images
  },
});

module.exports = {
  cloudinary,
  uploadAudio,
  uploadAvatar,
};
