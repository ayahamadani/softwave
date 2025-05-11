import './App.css';
import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import SongContext from './components/context/SongContext';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import LikedSongs from './pages/LikedSongs';
import Playlists from "./pages/Playlists";
import Loader from './components/Loader/Loader';
import Navbar from './components/Navbar/Navbar';
import AdminPanel from './pages/AdmingPanel/AdminPanel';
import Profile from './pages/Profile/Profile';
import BottomPlayer from './components/BottomPlayer/BottomPlayer';
import ProtectedRoute from './components/ProtectedRoute';
import PlaylistDetail from './pages/IndividualPlaylist/PlaylistDetail';
import { BrowserRouter as Router, Routes, Route, useLocation  } from "react-router-dom";

function App() {
  const [currentSongData, setCurrentSongData] = useState({});
  const [currentSongAudio, setCurrentSongAudio] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [volume, setVolume] = useState(1);
  const [userIcon, setUserIcon]= useState("");
  const [likedSongsFront, setLikedSongsFront] = useState([]);
  const [currentQueue, setCurrentQueue] = useState([]);
  const [user, setUser] = useState(null);


  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const navbarInput = document.querySelector("#navbarSearchInput");

  // State to track if the current logged in user is an admin or not
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // To hide the bottom player from both the login and signup pages
  const hidePlayer = location.pathname === "/" || location.pathname === "/signup";

  // useEffect that gets triggered when changing pages
  useEffect(() => {
    if (navbarInput) navbarInput.value = "";
    setSearchQuery("");
    setLoading(true);
    
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  const playSong = useCallback(async (song, songCollection) => {
    if (!song || !song.audio) {
      console.error("Invalid song or audio source");
      return;
    }
  
    // Always update the queue first
    setCurrentQueue(Array.isArray(songCollection) ? songCollection : [song]);
  
    // If same song is playing/paused
    if (currentSongData?._id === song._id) {
      try {
        if (currentSongData?.isPlaying) {
          await currentSongAudio?.pause();
          setCurrentSongData(prev => ({ ...prev, isPlaying: false }));
        } else {
          await currentSongAudio?.play();
          setCurrentSongData(prev => ({ ...prev, isPlaying: true }));
        }
        return;
      } catch (err) {
        console.error("Play/pause error:", err);
      }
    }
  
    // For new song
    try {
      // Clean up current audio
      if (currentSongAudio) {
        currentSongAudio.pause();
        currentSongAudio.src = '';
      }
  
      const newAudio = new Audio(song.audio);
      newAudio.volume = volume;
      
      newAudio.addEventListener('canplaythrough', async () => {
        try {
          await newAudio.play();
          setCurrentSongAudio(newAudio);
          setCurrentSongData({ ...song, isPlaying: true });
        } catch (err) {
          console.error("Play failed:", err);
          setCurrentSongData(prev => ({ ...prev, isPlaying: false }));
        }
      }, { once: true });
  
      newAudio.addEventListener('error', () => {
        console.error("Audio loading error");
        setCurrentSongData(prev => ({ ...prev, isPlaying: false }));
      });
  
    } catch (err) {
      console.error("Audio setup error:", err);
    }
  }, [currentSongAudio, currentSongData, volume]);
  
  // Function which returns the song index by a given id
  const getSongIndex = (songId) => {
    for (let i = 0; i < songs.length; i++) {
      if (songs[i]._id === songId) return i;
    }
  };

  // Function which skips the current playing songs
  const skipSong = useCallback((song, pause = false) => {
    if (!song || !song.audio || !currentQueue || !currentQueue.length) return;
  
    const currentIndex = currentQueue.findIndex(s => s._id === song._id);
    if (currentIndex === -1) return;
  
    const nextIndex = (currentIndex + 1) % currentQueue.length;
    const nextSong = currentQueue[nextIndex];
  
    // Clean up current audio
    if (currentSongAudio) {
      currentSongAudio.pause();
      currentSongAudio.src = '';
    }
  
    const newAudio = new Audio(nextSong.audio);
    newAudio.volume = volume;
    
    setCurrentSongAudio(newAudio);

    setCurrentSongData({ ...nextSong, isPlaying: true }); 
  
    if (!pause) {
      newAudio.play()
        .then(() => {
          setCurrentSongData({ ...nextSong, isPlaying: true });
        })
        .catch(err => {
          console.error("Failed to play:", err);
          setCurrentSongData({ ...nextSong, isPlaying: false });
        });
    } else {
      setCurrentSongData({ ...nextSong, isPlaying: false });
    }
    
  }, [currentQueue, currentSongAudio, volume]);

  // Function to rewind the song or skip to the previous one
const rewindSong = useCallback((song) => {
  if (!song || !song.audio || !currentQueue || !currentQueue.length) return;

  const currentIndex = currentQueue.findIndex(s => s._id === song._id);
  if (currentIndex === -1) return;

  let prevSong;
  if (currentIndex === 0) {
    prevSong = currentQueue[currentQueue.length - 1];
  } else {
    prevSong = currentQueue[currentIndex - 1];
  }

  // If >2 seconds in current song, restart same song
  if (currentSongAudio?.currentTime > 2) {
    currentSongAudio.currentTime = 0;
    if (!currentSongData?.isPlaying) {
      currentSongAudio.pause();
    }
    return;
  }

  // Clean up current audio
  if (currentSongAudio) {
    currentSongAudio.pause();
    currentSongAudio.src = '';
  }

  const newAudio = new Audio(prevSong.audio);
  newAudio.volume = volume;
  
  setCurrentSongAudio(newAudio);
  setCurrentSongData({ 
    ...prevSong, 
    isPlaying: true 
  });

  newAudio.play()
  .then(() => {
    setCurrentSongData(prev => ({
      ...prev,
      ...prevSong,
      isPlaying: true
    }));
  })
  .catch(err => {
    console.error("Failed to play:", err);
    setCurrentSongData(prev => ({ ...prev, isPlaying: false }));
  });

}, [currentQueue, currentSongAudio, currentSongData, volume]);

  // Like a song function
 const toggleLike = async (song) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    console.error("User not found in localStorage");
    return;
  }

  try {
    let updatedLikedSongs;

    if (song.isLiked) {
      // Unlike the song
      await axios.delete(`https://softwave-music-player.onrender.com/likedsongs/${user.userId}/${song._id}`);

      // Remove from likedSongsFront
      updatedLikedSongs = likedSongsFront.filter((s) => s._id !== song._id);
    } else {
      // Like the song
      await axios.post(`https://softwave-music-player.onrender.com/likedsongs/${user.userId}/${song._id}`);

      // Add to likedSongsFront
      updatedLikedSongs = [...likedSongsFront, { ...song, isLiked: true }];
    }

    setLikedSongsFront(updatedLikedSongs);


    
    // Update the state to reflect the new liked status
    setCurrentSongData({
      ...song,
      isLiked: !song.isLiked,
    });
    
    if(currentSongData.isLiked){
      
    }

    setCurrentQueue((prevSongs) =>
      prevSongs.map((s) =>
        s._id === song._id ? { ...s, isLiked: !s.isLiked } : s
      )
    );

    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  useEffect(() => {
    const handleSongEnd = () => {
      if (!currentQueue || !currentQueue.length) return;
      
      if (currentQueue.findIndex(s => s._id === currentSongData._id) === currentQueue.length - 1) {
        skipSong(currentSongData, false);
      } else {
        skipSong(currentSongData);
      }
    };
  
    if (currentSongAudio) {
      currentSongAudio.volume = volume;
      currentSongAudio.addEventListener("ended", handleSongEnd);
    }
  
    return () => {
      if (currentSongAudio) {
        currentSongAudio.removeEventListener("ended", handleSongEnd);
      }
    };
  }, [currentSongAudio, currentSongData, currentQueue, skipSong, volume]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    let userId = null;
    if(user) {
      userId = user.userId;
    } else {
      return;
    }

    axios
    .get(`https://softwave-music-player.onrender.com/likedsongs/${userId}`)
    .then((res) => {
      setLikedSongsFront(res.data);

      setCurrentQueue(prevQueue =>
        prevQueue.map(song => ({
          ...song,
          isLiked: res.data.some(liked => liked._id === song._id)
        }))
      );
    })
    .catch((err) => console.error("Failed to fetch liked songs", err));

    axios
    .get(`https://softwave-music-player.onrender.com/auth/${userId}`)
    .then((res) => {
      setUserIcon(res.data.icon);
    })
    .catch((err) => console.error("Failed to fetch Icon", err));
  }, []);


  return (
  <SongContext.Provider
    value={{
      currentSongData,
      setCurrentSongData,
      playSong,
      currentSongAudio,
      setCurrentSongAudio,
      rewindSong,
      songs,
      setSongs,
      getSongIndex,
      skipSong,
      toggleLike,
      searchQuery,
      setSearchQuery,
      volume,
      setVolume,
      userIcon,
      setUser,
      user,
      setUserIcon,
      likedSongsFront,
      setLikedSongsFront,
      setCurrentQueue,
      currentQueue
    }}
  >
    {!hidePlayer && <Navbar setSearchQuery={setSearchQuery}/>}
    {loading ? (
      <Loader />
    ) : (
      <>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route 
            path="/adminPanel" 
            element={
              <ProtectedRoute user={user} adminOnly={true}>
                {/* The children in this context is the AdminPanel component */}
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/likedSongs" element={<LikedSongs />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/playlists/:_id" element={<PlaylistDetail />} />
        </Routes>
      </>
    )}
    {!hidePlayer && currentSongAudio && <BottomPlayer />}
  </SongContext.Provider>
);

} 

export default App;
