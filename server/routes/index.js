const express = require("express");
const rootRouter = express.Router();
const User = require("../models/user");
const Song = require("../models/song");
const userRouter = require("./user");
const songRouter = require("./song");
const playlistRouter = require("./playlist");

module.exports = rootRouter;

rootRouter.get("/", (req, res) => {
    res.json({"message": "I love freddy fazebear"});
});

rootRouter.use("/auth", userRouter);
rootRouter.use("/songs", songRouter);
rootRouter.use("/playlists", playlistRouter);