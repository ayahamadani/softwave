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

songRouter.put("/:id/toggle-like", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) return res.status(404).json({ error: "Song not found" });

    song.isLiked = !song.isLiked;
    await song.save();

    res.json({ message: 'Song liked!', song });
  } catch (err) {
    console.error("Toggle like error", err);
    res.status(500).json({ error: "Server error, something went wrong" });
  }
});


// songRouter.get('/:id', async (req, res) => {
//     try {
//       const song = await Song.findById(req.params.id);
//       res.json(song);
//     } catch (err) {
//       res.status(500).json({ error: 'Song not found' });
//     }
//   });