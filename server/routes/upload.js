const express = require("express");
const multer = require("multer");
const AWS = require('aws-sdk');
const uploadRouter = express.Router();
const { v4: uuidv4 } = require('uuid');
const User = require("../models/user");
const Song = require("../models/song");
const Playlist = require("../models/playlist");
const { AWS_REGION, AWS_SECRET_KEY, AWS_ACCESS_KEY, AWS_BUCKET_NAME } = require("../secrets");

const s3 = new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
    region: AWS_REGION
});

console.log("This is the AWS_REGION: " + AWS_REGION);

const storage = multer.memoryStorage();
const upload = multer({ storage });

uploadRouter.post("/:userId/upload-avatar", upload.single("avatar"), async (req, res) => {
  const { userId } = req.params;
  const file = req.file;

  if (!file) return res.status(400).json({ message: "No file uploaded" });

  const s3Params = {
    Bucket: "my-songs-bucket443181317692",
    Key: `user-icons/${userId}_${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const uploadResult = await s3.upload(s3Params).promise();

    // Save URL to user's avatar field in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { icon: uploadResult.Location },
      { new: true }
    );

    res.status(200).json({ avatarUrl: uploadResult.Location, user: updatedUser });
  } catch (err) {
    console.error("S3 upload error:", err);
    res.status(500).json({ message: "Failed to upload avatar", error: err.message });
  }
});


uploadRouter.post("/:userId/upload-song", upload.fields([
  { name: 'albumCover', maxCount: 1 },
  { name: 'songFile', maxCount: 1 }
]), async (req, res) => {
  console.log("Upload route hit");
  const { userId } = req.params;
  const { songName, artist, genre } = req.body;
  const files = req.files;

  if (!files.albumCover || !files.songFile) {
    return res.status(400).json({ message: "Album cover or song file missing" });
  }

  const albumCoverFile = files.albumCover[0];
  const songFile = files.songFile[0];

  try {
    // Upload album cover to S3
    const coverParams = {
      Bucket: "my-songs-bucket443181317692",
      Key: `album-covers/${userId}_${Date.now()}_${albumCoverFile.originalname}`,
      Body: albumCoverFile.buffer,
      ContentType: albumCoverFile.mimetype,
    };
    const coverUpload = await s3.upload(coverParams).promise();

    // Upload song file to S3
    const songParams = {
      Bucket: "my-songs-bucket443181317692",
      Key: `songs/${userId}_${Date.now()}_${songFile.originalname}`,
      Body: songFile.buffer,
      ContentType: songFile.mimetype,
    };
    const songUpload = await s3.upload(songParams).promise();

    // Save song metadata to MongoDB
    const newSong = await Song.create({
      name: songName,
      artist,
      genre,
      albumCover: coverUpload.Location,
      audio: songUpload.Location
    });

    res.status(200).json({ message: "Song uploaded successfully", song: newSong });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});
  
uploadRouter.post("/:userId/:playlistId", upload.single("playlistCover"), async (req, res) => {
  const { userId, playlistId } = req.params;
  const file = req.file;

  if (!file) return res.status(400).json({ message: "No file uploaded" });

  const s3Params = {
    Bucket: AWS_BUCKET_NAME,
    Key: `playlist-covers/${playlistId}_${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const uploadResult = await s3.upload(s3Params).promise();

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
      { playlistIcon: uploadResult.Location },
      { new: true }
    );

    res.status(200).json({ 
      coverUrl: uploadResult.Location, 
      playlist: updatedPlaylist 
    });
  } catch (err) {
    console.error("S3 upload error:", err);
    res.status(500).json({ 
      message: "Failed to upload playlist cover", 
      error: err.message 
    });
  }
});

module.exports = uploadRouter;

