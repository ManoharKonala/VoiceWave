const Audio = require('../models/Audio');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Upload a new audio
// @route   POST /api/audio/upload
// @access  Private
const uploadAudio = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, tags, duration } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ msg: 'Please upload an audio file' });
    }

    // Create new audio
    const audio = new Audio({
      user: req.user.id,
      title,
      description: description || '',
      tags: tags ? tags.split(',').map(tag => tag.trim().toLowerCase()) : [],
      audioUrl: req.file.path,
      duration: parseInt(duration) || 0,
    });

    await audio.save();

    // Populate user data
    await audio.populate('user', 'username avatar');

    res.status(201).json(audio);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all audios
// @route   GET /api/audio
// @access  Public
const getAudios = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = { isPrivate: false };
    
    // Filter by user if userId is provided
    if (req.query.userId) {
      query.user = req.query.userId;
    }
    
    // Filter by tag if provided
    if (req.query.tag) {
      query.tags = req.query.tag.toLowerCase();
    }
    
    // Search query
    if (req.query.q) {
      query.$text = { $search: req.query.q };
    }

    const audios = await Audio.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'username avatar')
      .populate('likes', 'username avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username avatar',
        },
        options: { sort: { createdAt: -1 }, limit: 3 },
      });

    const total = await Audio.countDocuments(query);

    res.json({
      audios,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalAudios: total,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get trending audios
// @route   GET /api/audio/trending
// @access  Public
const getTrendingAudios = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    // Get trending audios using aggregation
    const trendingAudios = await Audio.aggregate([
      {
        $match: {
          isPrivate: false,
          // Only include audios from the last 7 days
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $addFields: {
          likeCount: { $size: '$likes' },
          commentCount: { $size: '$comments' },
        },
      },
      {
        $sort: {
          likeCount: -1,
          commentCount: -1,
          createdAt: -1,
        },
      },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          'user.password': 0,
          'user.email': 0,
          'user.followers': 0,
          'user.following': 0,
        },
      },
    ]);

    res.json(trendingAudios);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get audio by ID
// @route   GET /api/audio/:id
// @access  Public
const getAudioById = async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id)
      .populate('user', 'username avatar')
      .populate('likes', 'username avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username avatar',
        },
        options: { sort: { createdAt: -1 } },
      });

    if (!audio) {
      return res.status(404).json({ msg: 'Audio not found' });
    }

    // Check if the audio is private and the current user is not the owner
    if (audio.isPrivate && (!req.user || audio.user._id.toString() !== req.user.id)) {
      return res.status(403).json({ msg: 'This audio is private' });
    }

    // Increment view count (you might want to track unique views per user)
    audio.views = (audio.views || 0) + 1;
    await audio.save();

    res.json(audio);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Audio not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Like/Unlike an audio
// @route   PUT /api/audio/like/:id
// @access  Private
const likeAudio = async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id);

    if (!audio) {
      return res.status(404).json({ msg: 'Audio not found' });
    }

    // Check if the audio has already been liked
    if (
      audio.likes.some(
        (like) => like.toString() === req.user.id
      )
    ) {
      // Unlike the audio
      audio.likes = audio.likes.filter(
        (like) => like.toString() !== req.user.id
      );
      await audio.save();
      return res.json({ msg: 'Audio unliked', isLiked: false });
    }

    // Like the audio
    audio.likes.unshift(req.user.id);
    await audio.save();

    res.json({ msg: 'Audio liked', isLiked: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete an audio
// @route   DELETE /api/audio/:id
// @access  Private
const deleteAudio = async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id);

    if (!audio) {
      return res.status(404).json({ msg: 'Audio not found' });
    }

    // Check user
    if (audio.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Delete audio file from Cloudinary
    // const publicId = audio.audioUrl.split('/').pop().split('.')[0];
    // await cloudinary.uploader.destroy(`voicewave/audios/${publicId}`, {
    //   resource_type: 'video',
    // });

    await audio.remove();

    res.json({ msg: 'Audio removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Audio not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Get audios from users that the current user follows
// @route   GET /api/audio/feed
// @access  Private
const getFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.user.id);
    
    // Get audios from users that the current user follows
    const audios = await Audio.find({
      user: { $in: user.following },
      isPrivate: false,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'username avatar')
      .populate('likes', 'username avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username avatar',
        },
        options: { sort: { createdAt: -1 }, limit: 2 },
      });

    const total = await Audio.countDocuments({
      user: { $in: user.following },
      isPrivate: false,
    });

    res.json({
      audios,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalAudios: total,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  uploadAudio,
  getAudios,
  getTrendingAudios,
  getAudioById,
  likeAudio,
  deleteAudio,
  getFeed,
};
