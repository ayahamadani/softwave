import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
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


  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const navbarInput = document.querySelector("#navbarSearchInput");

  // State to track if the current logged in user is an admin or not
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

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
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    console.error("User not found in localStorage");
    return;
  }

  try {
    let updatedLikedSongs;

    if (song.isLiked) {
      // Unlike the song
      await axios.delete(`http://localhost:5000/likedsongs/${user.userId}/${song._id}`);

      // Remove from likedSongsFront
      updatedLikedSongs = likedSongsFront.filter((s) => s._id !== song._id);
    } else {
      // Like the song
      await axios.post(`http://localhost:5000/likedsongs/${user.userId}/${song._id}`);

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

    setSongs((prevSongs) =>
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
      if (getSongIndex(currentSongData._id) === songs.length - 1) {
        skipSong(currentSongData, false);
      } else skipSong(currentSongData);
    };

    // Add event listener for the 'ended' event on the current audio element
    if (currentSongAudio) {
      currentSongAudio.volume = volume;
      currentSongAudio.addEventListener("ended", handleSongEnd);
    }

    // Cleanup the event listener when the component unmounts or when currentSongAudio changes
    return () => {
      if (currentSongAudio) {
        currentSongAudio.removeEventListener("ended", handleSongEnd);
      }
    };
  }, [currentSongAudio, currentSongData, songs]);

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"));
    let userId = null;
    if(user) {
      userId = user.userId;
    } else {
      return;
    }
    axios
    .get(`http://localhost:5000/auth/${userId}`)
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
      setUserIcon,
      likedSongsFront,
      setLikedSongsFront
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
