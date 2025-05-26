const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const rootRouter = require('./routes');

// const songsRoute = require('./routes/songs');

const app = express();
const PORT = process.env.PORT || 5000;

//Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files
app.use(cors({
  origin: 'http://softwave-bucket.s3-website.eu-north-1.amazonaws.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));    
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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


