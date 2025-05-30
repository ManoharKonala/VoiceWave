const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect } = require('../middleware/auth');
const { 
  registerUser, 
  loginUser, 
  getMe, 
  updateProfile, 
  uploadAvatarHandler 
} = require('../controllers/authController');
const { uploadAvatar } = require('../config/cloudinary');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  registerUser
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  loginUser
);

// @route   GET /api/auth/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', protect, getMe);

// @route   PUT /api/auth/update-profile
// @desc    Update user profile
// @access  Private
router.put(
  '/update-profile',
  [
    protect,
    check('username', 'Username is required').optional().not().isEmpty(),
    check('bio', 'Bio cannot be longer than 160 characters').optional().isLength({ max: 160 }),
  ],
  updateProfile
);

// @route   PUT /api/auth/upload-avatar
// @desc    Upload user avatar
// @access  Private
router.put(
  '/upload-avatar',
  protect,
  uploadAvatar.single('avatar'),
  uploadAvatarHandler
);

module.exports = router;
