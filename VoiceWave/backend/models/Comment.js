const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    audio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Audio',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    audioComment: {
      type: String, // URL to audio comment
      default: '',
    },
    audioDuration: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

// Virtual for like count
commentSchema.virtual('likeCount').get(function () {
  return this.likes.length;
});

// Index for faster querying
commentSchema.index({ audio: 1, createdAt: -1 });


module.exports = mongoose.model('Comment', commentSchema);
