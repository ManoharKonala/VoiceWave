const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 500,
      default: '',
    },
    audioUrl: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual for like count
audioSchema.virtual('likeCount').get(function () {
  return this.likes.length;
});

// Virtual for comment count
audioSchema.virtual('commentCount').get(function () {
  return this.comments.length;
});

// Index for text search
audioSchema.index({ 
  title: 'text', 
  description: 'text',
  tags: 'text' 
});

// Static method to get audios by user
// audioSchema.statics.findByUserId = function(userId) {
//   return this.find({ user: userId });
// };

// Static method to get trending audios
audioSchema.statics.getTrending = function(limit = 10) {
  return this.aggregate([
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
  ]);
};

module.exports = mongoose.model('Audio', audioSchema);
