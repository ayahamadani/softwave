const express = require("express");
const multer = require("multer");
const AWS = require('aws-sdk');
const uploadRouter = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

module.exports = uploadRouter;

// const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY,
//     secretAccessKey: process.env.AWS_SECRET_KEY,
//     region: "eu-north-1"
// });

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// uploadRouter.use((req, res, next) => {
//   console.log(`${req.method} ${req.originalUrl}`);
//   next();
// });

// Set the region and access keys
// AWS.config.update({
//     region: process.env.AWS_REGION,
//     accessKeyId: process.env.AWS_ACCESS_KEY,
//     secretAccessKey: process.env.AWS_SECRET_KEY
// });

// // Create a new instance of the S3 class
// const s3 = new AWS.S3();

// const key = `album-covers/${uuidv4()}${path.extname(localFilePath)}`;

// // Set the parameters for the file you want to upload
// const params = {
//     Bucket: 'my-songs-bucket443181317692',
//     Key: key,
//     Body: fs.createReadStream('path/to/myFile.txt'),
//     ContentType: 'img/*'
// };

// // Upload the file to S3
// s3.upload(params, (err, data) => {
//     if (err) {
//         console.log('Error uploading file:', err);
//     } else {
//         console.log('File uploaded successfully. File location:', data.Location);
//     }
// });

  

// POST /upload
// uploadRouter.post(
//     '/',
//     upload.fields([{ name: 'audio' }, { name: 'image' }]),
//     async (req, res) => {
//       console.log("FILES RECEIVED:", req.files);
      
//       const audioFile = req.files.audio?.[0];
//       const imageFile = req.files.image?.[0];
  
//       if (!audioFile || !imageFile) {
//         return res.status(400).json({ error: "Missing files" });
//       }
  
//       try {
//         const uploadToS3 = (file, folder) => {
//           const params = {
//             Bucket: process.env.S3_BUCKET_NAME,
//             Key: `${folder}/${uuidv4()}-${file.originalname}`,
//             Body: file.buffer,
//             ContentType: file.mimetype,
//           };
//           return s3.upload(params).promise();
//         };
  
//         const audioUpload = await uploadToS3(audioFile, 'songs');
//         const imageUpload = await uploadToS3(imageFile, 'images');
  
//         res.json({
//           audioUrl: audioUpload.Location,
//           imageUrl: imageUpload.Location,
//         });
//       } catch (err) {
//         console.error("Upload error:", err);
//         res.status(500).json({ error: "Upload failed" });
//       }
//     }
//   );
  
  
