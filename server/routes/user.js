const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");

module.exports = userRouter;

userRouter.get("/", async (req, res) => {
    const users = await User.find();
    res.json(users);
});
