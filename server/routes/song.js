const express = require("express");
const songRouter = express.Router();
const Song = require("../models/song");

module.exports = songRouter;

// GET /songs/search?name=songname
songRouter.get("/search", async (req, res) => {
  const songName = req.query.name;

  try {
    const songs = await Song.find({
      name: { $regex: songName, $options: "i" }
    });
    res.json(songs);
  } catch (err) {
    console.error("Error searching songs:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


songRouter.get("/", async (req, res) => {
    const songs = await Song.find();
    res.json(songs);
});

// POST /songs
songRouter.post("/", async (req, res) => {
  try {
    const { name, artist, genre, audioUrl, albumCover } = req.body;
    const newSong = new Song({ name, artist, genre, audioUrl, albumCover });
    await newSong.save();
    res.status(201).json(newSong);
  } catch (err) {
    console.error("Failed to save song:", err);
    res.status(500).json({ error: "Failed to save song" });
  }
});
