const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv'); 
const { body, validationResult } = require('express-validator');
const userRouter = express.Router();
const User = require("../models/user");
const AWS = require('aws-sdk');
const sendEmail = require("../util/sendEmail");
const { JWT_SECRET } = require("../secrets");
dotenv.config({ path: "../config/config.env" });

// Adding a user
// post /auth/signup
userRouter.post('/signup', [
    // using express validator
    body('username').notEmpty().isLength({ min: 6}).withMessage('username is required').matches(/^\S+$/).withMessage('Username must not contain spaces'),
    body('email').notEmpty().withMessage('invalid email'),
    body('password')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters'),
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
        let userName = await User.findOne({username: username.toLowerCase()});

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
        const isAdmin = user.isAdmin;
        const userId = user._id;
        const icon = user.icon;
        res.status(200).json({ username, isAdmin, userId, icon });
        
    } catch (error) {
        res.status(500).json({ message: 'Server error', error});
    }
});

// Getting a user based on the username
userRouter.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user with case-insensitive username
        const user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });

        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "wrong password" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const isAdmin = user.isAdmin;
        const userId = user._id;
        const icon = user.icon;
        res.status(200).json({ username: user.username, isAdmin, userId, icon });

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

// Get user based on Id
// GET /auth/:userId
userRouter.get("/:userId", async (req, res) => {
   try{
    
    const user = await User.findById(req.params.userId);
    if(!user) return res.status(400).json({ message: "user does not exist"});

    res.json(user);
   } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "server error"});
   }
});

userRouter.put("/:userId/makeAdmin", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if(!user) return res.status(400).json({ message: "user does not exist"});

        user.isAdmin = !user.isAdmin;
        await user.save();

        return res.status(200).json({ message: "User admin status updated", user });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
});

userRouter.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  console.log("Forgot password request for:", email); // Log the incoming email

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Email not found in database");
      return res.status(404).json({ message: "Email not found" });
    }

    console.log("User found:", user._id);
    console.log("JWT_SECRET:", process.env.JWT_SECRET)
    
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: "15m" }
    );
    console.log("Token generated:", token);
    

    const resetLink = `http://softwave-bucket.s3-website.eu-north-1.amazonaws.com//reset-password/${token}`;
    const emailText = `Hi ${user.username},\n\nReset your password: ${resetLink}`;

    console.log("Attempting to send email...");
    await sendEmail(user.email, "Password Reset", emailText);
    console.log("Email sent successfully");

    res.status(200).json({ message: "Password reset link sent to your email." });

  } catch (err) {
    console.error("Full error:", err);
    res.status(500).json({ 
      message: "Failed to send reset link.",
      error: err.message // Include the actual error message
    });
  }
});

userRouter.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.status(200).json({ message: "Password reset successful." });

  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid or expired token." });
  }
});

// DELETE /auth/:userId 
userRouter.delete('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = userRouter;
