const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv'); 
const { body, validationResult } = require('express-validator');
const userRouter = express.Router();
const User = require("../models/user");

dotenv.config({ path: "../config/config.env" });

// Adding a user
// post /auth/signup
userRouter.post('/signup', [
    // using express validator
    body('username').notEmpty().isLength({ min: 6}).withMessage('username is required'),
    body('email').notEmpty().withMessage('invalid email'),
    body('password').isLength({ min: 6 }).withMessage('password must be at least 6 characters'),
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        // errors.array() is an express validator, returns true if there are no errors
        return res.status(400).json({ errors: errors.array()});
    }

    const { username, email, password } = req.body;

    // check if a user already exists
    try {
        let userEmail  = await User.findOne({email});
        let userName = await User.findOne({username});

        if (userName) {
            return res.status(400).json({ message: 'username is taken'});
        }
        if (userEmail) {
            return res.status(400).json({ message: 'email is taken'});
        }

        // Hash the password
        // generating a random 10 character string (a salt)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        // create a new user
        const user = new User({username, email, password: hashedPassword, isAdmin: false});
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'user registered successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error});
    }
});

// Getting a user based on the username
userRouter.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({username});

        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "wrong password" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Login successful", token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error });
    }

});

// Getting all users
userRouter.get("/", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

module.exports = userRouter;
