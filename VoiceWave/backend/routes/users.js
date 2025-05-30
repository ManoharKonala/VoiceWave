const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getUserProfile,
  getUserAudios,
  followUser,
  searchUsers,
  getUserFollowers,
  getUserFollowing,
} = require('../controllers/userController');

// @route   GET /api/users/:username
// @desc    Get user profile
// @access  Public
router.get('/:username', getUserProfile);

// @route   GET /api/users/:username/audios
// @desc    Get user's audios
// @access  Public
router.get('/:username/audios', getUserAudios);

// @route   PUT /api/users/follow/:userId
// @desc    Follow/Unfollow a user
// @access  Private
router.put('/follow/:userId', protect, followUser);

// @route   GET /api/users/search
// @desc    Search users
// @access  Public
router.get('/search', searchUsers);

// @route   GET /api/users/:username/followers
// @desc    Get user's followers
// @access  Public
router.get('/:username/followers', getUserFollowers);

// @route   GET /api/users/:username/following
// @desc    Get users that the user is following
// @access  Public
router.get('/:username/following', getUserFollowing);

module.exports = router;
