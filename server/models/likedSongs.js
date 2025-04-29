const mongoose = require('mongoose');

const likedSongsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song"
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('LikedSongs', likedSongsSchema);
