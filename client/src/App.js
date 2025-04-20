import './App.css';
import axios from 'axios';
import { useEffect, useState, createContext } from 'react';
import SongContext from './components/context/SongContext';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import LikedSongs from './pages/LikedSongs';
import Playlists from "./pages/Playlists";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [currentSongData, setCurrentSongData] = useState({});
  const [currentSongAudio, setCurrentSongAudio] = useState(null);
  const [songs, setSongs] = useState([]);

  const playSong = (song) => {
    if (!song || !song.audio) {
      console.error("Invalid song or audio source");
      return;
    }

    // If it's the same song and playing, pause it
    if (currentSongData && currentSongData._id === song._id && currentSongData.isPlaying) {
      currentSongAudio.pause();
      setCurrentSongData({ ...song, isPlaying: false });
      return;
    }
  
    // If it's the same song and paused, resume it
    if (currentSongData && currentSongData._id === song._id && !currentSongData.isPlaying) {
      currentSongAudio.play();
      setCurrentSongData({ ...song, isPlaying: true });
      return;
    }
  
    // If none of the above (new song) play the song
    fetch(song.audio)
      .then(res => res.blob())
      .then(data => {
        if (currentSongAudio) {
          currentSongAudio.pause();
        }
  
        const audioURL = URL.createObjectURL(data);
        const newAudio = new Audio(audioURL);
        setCurrentSongAudio(newAudio);
        setCurrentSongData({ ...song, isPlaying: true });
        newAudio.play();
      })
      .catch(err => console.error("Error playing song:", err));
  };

  // Function which returns the song index by a given id
  const getSongIndex = (songId) => {
    for (let i = 0; i < songs.length; i++) {
      if (songs[i]._id === songId) return i;
    }
  };

  // Function which skips the current playing songs
  const skipSong = (song, pause = false) => {
    if (!song || !song.audio) {
      console.error("Invalid song or audio source");
      return;
    }

    if (!currentSongData || !songs.length) return;
  
    const currentIndex = getSongIndex(song._id);
    const nextIndex = (currentIndex + 1) % songs.length;
  
    // Stop current audio
    if (currentSongAudio) {
      currentSongAudio.pause();
    }
  
    const nextSong = songs[nextIndex];
    const newAudio = new Audio(nextSong.audio);
  
    setCurrentSongAudio(newAudio);
    setCurrentSongData({ ...nextSong, isPlaying: true });
  
    if (!pause) {
      newAudio.play();
    }
  };

  // Function to rewind the song or skip to the previous one
  const rewindSong = (song) => {
    if (!song || !song.audio) {
      console.error("Invalid song or audio source");
      return;
    }

    // Song currently palying before skipping
    let currentSong = song;
    // Song we're rewinding to
    let prevSong;

    const currentIndex = getSongIndex(song._id);
    if (currentIndex === 0) 
      prevSong = songs[songs.length - 1];
    else prevSong = songs[currentIndex - 1];
    // If we're more than two seconds in the current song, we replay the same
    if (currentSongAudio.currentTime > 2) {
      if (song.isPlaying) {
        currentSongAudio.pause();
        setCurrentSongData({ ...currentSong, isPlaying: false });
        const newAudio = new Audio (currentSong.audio);
        setCurrentSongAudio(newAudio);
        setCurrentSongData({ ...currentSong, isPlaying: true });
        newAudio.play();
      } else { // if the song isnt playing and trying to rewind while paused
        const newAudio = new Audio (currentSong.audio);
        setCurrentSongAudio(newAudio);
      }
    } else if (prevSong) {
      currentSongAudio.pause();
      setCurrentSongData({ ...currentSong, isPlaying: false });
      const newAudio = new Audio(prevSong.audio);
      setCurrentSongAudio(newAudio);
      setCurrentSongData({ ...prevSong, isPlaying: true });
      newAudio.play();
    }
  };

  // Like a song function
  const toggleLike = async (song) => {
    try {
      const res = await axios.put(`http://localhost:5000/songs/${song._id}/toggle-like`);
      setCurrentSongData({
        ...song,
        isLiked: !song.isLiked
      });
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };


  return (
    <SongContext.Provider value={{ currentSongData, setCurrentSongData, playSong, currentSongAudio, setCurrentSongAudio, rewindSong, songs, setSongs, getSongIndex, skipSong, toggleLike }} >
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/likedSongs" element={<LikedSongs />} />
          <Route path="/playlists" element={<Playlists />} />
        </Routes>
      </Router>
    </SongContext.Provider>
  );
} 

export default App;
