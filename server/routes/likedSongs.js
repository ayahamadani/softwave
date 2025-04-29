const express = require('express');
const likedSongsRouter = express.Router();
const LikedSongs = require('../models/likedSongs');
const Song = require('../models/song'); 

// Like a song (add to liked songs)
likedSongsRouter.post('/:userId/:songId', async (req, res) => {
  const { userId, songId } = req.params;

  try {
    let likedSongs = await LikedSongs.findOne({ userId });

    if (!likedSongs) {
      likedSongs = new LikedSongs({ userId, songs: [songId] });
    } else {
      if (!likedSongs.songs.includes(songId)) {
        likedSongs.songs.push(songId);
      }
    }

    await likedSongs.save();
    res.status(200).json(likedSongs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error liking song" });
  }
});

// Unlike a song (remove from liked songs)
likedSongsRouter.delete('/:userId/:songId', async (req, res) => {
  const { userId, songId } = req.params;

  try {
    const likedSongs = await LikedSongs.findOne({ userId });

    if (!likedSongs) {
      return res.status(404).json({ message: "Liked songs not found" });
    }

    likedSongs.songs.pull(songId);
    await likedSongs.save();
    res.status(200).json(likedSongs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error unliking song" });
  }
});

// Get all liked songs for a user
likedSongsRouter.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const likedSongs = await LikedSongs.findOne({ userId }).populate('songs');
    if (!likedSongs) {
      return res.status(404).json({ message: "Liked songs not found" });
    }
    res.status(200).json(likedSongs.songs); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching liked songs" });
  }
});

module.exports = likedSongsRouter;
