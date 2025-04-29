const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  name: String,
  artist: String,
  genre: String,
  albumCover: String,
  audio: String
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;