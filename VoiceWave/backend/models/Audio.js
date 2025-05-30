// Audio model for VoiceWave
// Stores audio post metadata and references to user and comments
const mongoose = require('mongoose');

const AudioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true }, // Cloudinary URL
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  createdAt: { type: Date, default: Date.now }
});

// Add more fields as needed for audio metadata, tags, etc.

module.exports = mongoose.model('Audio', AudioSchema);
