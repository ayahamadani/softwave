const express = require("express");
const rootRouter = express.Router();
const User = require("../models/user");
const Song = require("../models/song");
const userRouter = require("./user");
const songRouter = require("./song");
const playlistRouter = require("./playlist");
const uploadRouter = require("./upload");

module.exports = rootRouter;

rootRouter.use("/auth", userRouter);
rootRouter.use("/songs", songRouter);
rootRouter.use("/upload", uploadRouter);
rootRouter.use("/playlists", playlistRouter);