const Comment = require('../models/Comment');
const Audio = require('../models/Audio');
const { validationResult } = require('express-validator');

// @desc    Add a comment to an audio
// @route   POST /api/comments/:audioId
// @access  Private
const addComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { content, audioComment, audioDuration } = req.body;
    
    const audio = await Audio.findById(req.params.audioId);
    
    if (!audio) {
      return res.status(404).json({ msg: 'Audio not found' });
    }

    // Check if the audio is private and the current user is not the owner
    if (audio.isPrivate && audio.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'This audio is private' });
    }

    // Create new comment
    const comment = new Comment({
      user: req.user.id,
      audio: req.params.audioId,
      content: content || '',
      audioComment: audioComment || '',
      audioDuration: audioDuration || 0,
    });

    await comment.save();

    // Add comment to audio
    audio.comments.unshift(comment._id);
    await audio.save();

    // Populate user data
    await comment.populate('user', 'username avatar');

    // Emit new comment via socket.io
    if (req.io) {
      req.io.to(req.params.audioId).emit('new_comment', comment);
    }

    res.status(201).json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get comments for an audio
// @route   GET /api/comments/audio/:audioId
// @access  Public
const getCommentsByAudio = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const audio = await Audio.findById(req.params.audioId);
    
    if (!audio) {
      return res.status(404).json({ msg: 'Audio not found' });
    }

    // Check if the audio is private and the current user is not the owner
    if (audio.isPrivate && (!req.user || audio.user.toString() !== req.user.id)) {
      return res.status(403).json({ msg: 'This audio is private' });
    }

    const comments = await Comment.find({ audio: req.params.audioId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'username avatar');

    const total = await Comment.countDocuments({ audio: req.params.audioId });

    res.json({
      comments,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalComments: total,
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Audio not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Like/Unlike a comment
// @route   PUT /api/comments/like/:id
// @access  Private
const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    // Check if the comment has already been liked
    if (
      comment.likes.some(
        (like) => like.toString() === req.user.id
      )
    ) {
      // Unlike the comment
      comment.likes = comment.likes.filter(
        (like) => like.toString() !== req.user.id
      );
      await comment.save();
      return res.json({ msg: 'Comment unliked', isLiked: false });
    }

    // Like the comment
    comment.likes.unshift(req.user.id);
    await comment.save();

    res.json({ msg: 'Comment liked', isLiked: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Remove comment from audio
    const audio = await Audio.findById(comment.audio);
    if (audio) {
      audio.comments = audio.comments.filter(
        (commentId) => commentId.toString() !== comment._id.toString()
      );
      await audio.save();
    }

    // Delete audio file if it's an audio comment
    // if (comment.audioComment) {
    //   const publicId = comment.audioComment.split('/').pop().split('.')[0];
    //   await cloudinary.uploader.destroy(`voicewave/comments/${publicId}`, {
    //     resource_type: 'video',
    //   });
    // }


    await comment.remove();

    res.json({ msg: 'Comment removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    res.status(500).send('Server Error');
  }
};

module.exports = {
  addComment,
  getCommentsByAudio,
  likeComment,
  deleteComment,
};
