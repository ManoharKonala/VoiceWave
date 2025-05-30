const User = require('../models/User');
const Audio = require('../models/Audio');

// @desc    Get user profile
// @route   GET /api/users/:username
// @access  Public
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password -email')
      .populate('followers', 'username avatar')
      .populate('following', 'username avatar');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Get user's public audios
    const audios = await Audio.find({
      user: user._id,
      isPrivate: false,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('likes', 'username avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username avatar',
        },
        options: { sort: { createdAt: -1 }, limit: 2 },
      });

    res.json({ ...user.toObject(), audios });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Get user's audios
// @route   GET /api/users/:username/audios
// @access  Public
const getUserAudios = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Check if the current user is the owner
    const isOwner = req.user && req.user.id === user._id.toString();
    
    // If not the owner, only show public audios
    const query = { user: user._id };
    if (!isOwner) {
      query.isPrivate = false;
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
        options: { sort: { createdAt: -1 }, limit: 2 },
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

// @desc    Follow/Unfollow a user
// @route   PUT /api/users/follow/:userId
// @access  Private
const followUser = async (req, res) => {
  try {
    // Check if user is trying to follow themselves
    if (req.params.userId === req.user.id) {
      return res.status(400).json({ msg: 'You cannot follow yourself' });
    }

    const userToFollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if already following
    const isFollowing = currentUser.following.some(
      (follow) => follow.toString() === userToFollow._id.toString()
    );

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        (follow) => follow.toString() !== userToFollow._id.toString()
      );
      userToFollow.followers = userToFollow.followers.filter(
        (follower) => follower.toString() !== currentUser._id.toString()
      );

      await currentUser.save();
      await userToFollow.save();

      return res.json({ 
        msg: `Unfollowed ${userToFollow.username}`, 
        isFollowing: false,
        followers: userToFollow.followers.length - 1
      });
    }

    // Follow
    currentUser.following.unshift(userToFollow._id);
    userToFollow.followers.unshift(currentUser._id);

    await currentUser.save();
    await userToFollow.save();

    // Here you might want to add a notification system
    // await Notification.create({
    //   user: userToFollow._id,
    //   type: 'follow',
    //   fromUser: currentUser._id,
    //   link: `/user/${currentUser.username}`,
    // });

    res.json({ 
      msg: `Following ${userToFollow.username}`, 
      isFollowing: true,
      followers: userToFollow.followers.length + 1
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Search users
// @route   GET /api/users/search
// @access  Public
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ msg: 'Please provide a search query' });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } },
      ],
    })
      .select('username avatar bio followers')
      .limit(10);

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get user's followers
// @route   GET /api/users/:username/followers
// @access  Public
const getUserFollowers = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('followers')
      .populate('followers', 'username avatar bio followers');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user.followers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get users that the user is following
// @route   GET /api/users/:username/following
// @access  Public
const getUserFollowing = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('following')
      .populate('following', 'username avatar bio followers');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user.following);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getUserProfile,
  getUserAudios,
  followUser,
  searchUsers,
  getUserFollowers,
  getUserFollowing,
};
