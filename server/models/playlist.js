const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
      required: true
    }
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  playlistIcon: {
     type: String,
     default: "https://my-songs-bucket443181317692.s3.eu-north-1.amazonaws.com/user-icons/catee.jpg"
  }
});

const Playlist = mongoose.model('Playlist', PlaylistSchema);
module.exports = Playlist;