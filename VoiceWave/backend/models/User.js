// User model for VoiceWave
// Defines the user schema for authentication and social features
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  audios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Audio' }],
  createdAt: { type: Date, default: Date.now }
});

// Add more fields as needed for profile, stats, etc.

module.exports = mongoose.model('User', UserSchema);
