const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect } = require('../middleware/auth');
const { uploadAudio } = require('../config/cloudinary');
const {
  addComment,
  getCommentsByAudio,
  likeComment,
  deleteComment,
} = require('../controllers/commentController');

// @route   POST /api/comments/:audioId
// @desc    Add a comment to an audio
// @access  Private
router.post(
  '/:audioId',
  [
    protect,
    uploadAudio.single('audioComment'),
    [
      check('content', 'Content or audio comment is required')
        .if((value, { req }) => !req.file)
        .not()
        .isEmpty()
        .withMessage('Content is required if no audio comment is provided'),
    ],
  ],
  addComment
);

// @route   GET /api/comments/audio/:audioId
// @desc    Get comments for an audio
// @access  Public
router.get('/audio/:audioId', getCommentsByAudio);

// @route   PUT /api/comments/like/:id
// @desc    Like/Unlike a comment
// @access  Private
router.put('/like/:id', protect, likeComment);

// @route   DELETE /api/comments/:id
// @desc    Delete a comment
// @access  Private
router.delete('/:id', protect, deleteComment);

module.exports = router;
