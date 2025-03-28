const express = require("express");
const rootRouter = express.Router();
const User = require("../models/user");
const Song = require("../models/song");
const userRouter = require("./user");
const songRouter = require("./song");

module.exports = rootRouter;

rootRouter.get("/", (req, res) => {
    res.json({"message": "I love freddy fazebear"});
});

rootRouter.use("/users", userRouter);

rootRouter.use("/songs", songRouter);