const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect } = require('../middleware/auth');
const { uploadAudio } = require('../config/cloudinary');
const {
  uploadAudio: uploadAudioHandler,
  getAudios,
  getTrendingAudios,
  getAudioById,
  likeAudio,
  deleteAudio,
  getFeed,
} = require('../controllers/audioController');

// @route   POST /api/audio/upload
// @desc    Upload a new audio
// @access  Private
router.post(
  '/upload',
  [
    protect,
    uploadAudio.single('audio'),
    [
      check('title', 'Title is required').not().isEmpty(),
      check('duration', 'Duration is required').isNumeric(),
    ],
  ],
  uploadAudioHandler
);

// @route   GET /api/audio
// @desc    Get all audios (with optional filters)
// @access  Public
router.get('/', getAudios);

// @route   GET /api/audio/trending
// @desc    Get trending audios
// @access  Public
router.get('/trending', getTrendingAudios);

// @route   GET /api/audio/feed
// @desc    Get audios from users that the current user follows
// @access  Private
router.get('/feed', protect, getFeed);

// @route   GET /api/audio/:id
// @desc    Get audio by ID
// @access  Public
router.get('/:id', getAudioById);

// @route   PUT /api/audio/like/:id
// @desc    Like/Unlike an audio
// @access  Private
router.put('/like/:id', protect, likeAudio);

// @route   DELETE /api/audio/:id
// @desc    Delete an audio
// @access  Private
router.delete('/:id', protect, deleteAudio);

module.exports = router;
