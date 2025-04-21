const express = require("express");
const playlistRouter = express.Router();
const Playlist = require("../models/playlist");

module.exports = playlistRouter;

// POST /playlists
playlistRouter.post("/", async (req, res) => {
    const { name, userId, songId } = req.body;
    let playlistName = await Playlist.findOne({name});

    if (!name || !userId || !songId) {
        return res.status(400).json({ error: "Name, userId, and at least one songId are required." });
    }

    if (playlistName) {
        return res.status(400).json({ message: 'name is taken'});
    }

    try {
        const newPlaylist = new Playlist({ name, user: userId, songs: [songId] });
        await newPlaylist.save();
        res.status(201).json(newPlaylist);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /playlists/:playlistId
playlistRouter.get("/:playlistId", async (req, res) => {
    const playlist = await Playlist.findById(req.params.playlistId);

    try {
        if(playlist){
          res.json(playlist); 
        } else {
            res.status(400).json({ error: "Playlist doesn't exist" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});

// PUT /playlists/:playlistId/add
playlistRouter.put("/:playlistId/add", async (req, res) => {
    const { songId } = req.body;
    try {
        const playlist = await Playlist.findById(req.params.playlistId);
        if (!playlist.songs.includes(songId)) {
        playlist.songs.push(songId);
        await playlist.save();
        }
        res.json(playlist);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
  
// GET /playlists/user/:userId
playlistRouter.get('/user/:userId', async (req, res) => {
    const playlists = await Playlist.find({ user: req.params.userId }).populate('songs');
    res.json(playlists);
});
