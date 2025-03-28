const express = require("express");
const songRouter = express.Router();
const Song = require("../models/song");

module.exports = songRouter;

songRouter.get("/", async (req, res) => {
    const songs = await Song.find();
    res.json(songs);
});
