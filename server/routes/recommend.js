const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const Song = require('../models/song');

const recommendRouter = express.Router();

// POST /recommend
recommendRouter.post('/', async (req, res) => {
  const { songIds } = req.body; // Expecting: "id1,id2,id3"

  if (!songIds) {
    return res.status(400).json({ error: 'Missing songIds in request body' });
  }

  const py = spawn('python', ['ai/recommend.py', songIds]);

  let data = '';
  let errorData = '';

  py.stdout.on('data', (chunk) => {
    data += chunk.toString();
  });

  py.stderr.on('data', (err) => {
    errorData += err.toString();
  });

  py.on('close', (code) => {
    if (errorData) {
      console.error('Python stderr:', errorData);
    }

    if (data.trim() === '') {
      return res.status(500).json({ error: 'Python script returned empty data' });
    }

    try {
      const recommendations = JSON.parse(data);
      if (recommendations.error) {
        return res.status(404).json(recommendations);
      }
      res.json(recommendations);
    } catch (e) {
      console.error('Failed to parse Python output:', e);
      console.error('Raw Python output:', data);
      res.status(500).json({ error: 'Failed to parse recommendations' });
    }
  });
});

// GET fallback (optional)
recommendRouter.get('/', async (req, res) => {
  const { songIds } = req.query;
  try {
    const songIdsArray = songIds?.split(',') || [];
    const allSongs = await Song.find();
    const recommendedSongs = allSongs
      .filter(song => !songIdsArray.includes(song._id.toString()))
      .slice(0, 2);
    res.json(recommendedSongs);
  } catch (err) {
    console.error('Error fetching recommendations:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = recommendRouter;
