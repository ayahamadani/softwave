const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const rootRouter = require('./routes');
const multer = require("multer");
const AWS = require("aws-sdk");

const PORT = process.env.PORT || 5000;

//Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files
const app = express();

app.use(cors());
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routers
app.use('/', rootRouter);

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}. http://localhost:${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error ${err.message}`);
})

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
  });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/upload", upload.single("audio"), (req, res) => {
  const file = req.file;
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `songs/${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read", // for public files
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(500).json({ error: "Upload failed" });
    }
    res.json({ message: "File uploaded", url: data.Location });
  });
});