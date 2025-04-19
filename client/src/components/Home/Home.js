import { React, useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import AdminPanel from '../AdmingPanel/AdminPanel';
import styles from './Home.module.css';
import image from "../assets/images/download.jpg";

export default function Home() {

  const [songs, setSongs] = useState([]);
  const [currentSongData, setCurrentSongData] = useState({});
  const [currentSongAudio, setCurrentSongAudio] = useState(null);
  const [time, setTime] = useState({
    current: 0,
    duration: 0,
    remaining: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      axios
        .get(`http://localhost:5000/songs/search?name=${encodeURIComponent(searchQuery)}`)
        .then((res) => {
          const songList = res.data.map(song => ({
            ...song,
            isPlaying: false
          }));
          setSongs(songList);
        })
        .catch((err) => console.error("Search failed:", err));
    } else {
      // If search is cleared, fetch all songs
      axios
        .get("http://localhost:5000/songs")
        .then((res) => {
          const songList = res.data.map(song => ({
            ...song,
            isPlaying: false
          }));
          setSongs(songList);
        })
        .catch((err) => console.error("Failed to fetch songs:", err));
    }
  }, [searchQuery]);


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

  const rewindSong = (song) => {
    
    if (!song || !song.audio) {
      console.error("Invalid song or audio source");
      return;
    }

    // if(currentSongAudio.currentTime > 2 && song._id === songs[0]._id) return;
    // Song currently palying before skipping
    let currentSong = song;
    // Song we're rewinding to
    let prevSong;
    const currentIndex = getSongIndex(song._id);
    if (currentIndex === 0) prevSong = null;
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

  useEffect(() => {
    const handleSongEnd = () => {
      if (getSongIndex(currentSongData._id) === songs.length - 1) {
        skipSong(currentSongData._id, true);
      } else skipSong(currentSongData._id);
    };

    // Add event listener for the 'ended' event on the current audio element
    // if (currentSongAudio) {
    //   if (currentSongAudio) {
    //     currentSongAudio.volume = volume;
    //   }
    //   currentSongAudio.addEventListener("ended", handleSongEnd);
    // }

    // Cleanup the event listener when the component unmounts or when currentSongAudio changes
    return () => {
      if (currentSongAudio) {
        currentSongAudio.removeEventListener("ended", handleSongEnd);
      }
    };
  }, [currentSongAudio, currentSongData, songs]);

  
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


  // useEffect(() => {
  //   if (!currentSongAudio) return;

  //   const intervalId = setInterval(() => {
  //     if (!currentSongAudio.paused) {
  //       const current = currentSongAudio.currentTime;
  //       const duration = currentSongAudio.duration || 0;
  //       const remaining = duration - current;

  //       setTime({
  //         current,
  //         duration,
  //         remaining,
  //       });
  //       console.log(time);
  //     }
  //   }, 1000);

  //   return () => clearInterval(intervalId);
  // }, [currentSongAudio]);
  

  // const setCurrentTimeValue = (time) => {
  //   if (!currentSongAudio.isPlaying) {
  //     currentSongAudio.currentTime = time;
  //     setCurrentTime(time);
  //   } else {
  //     currentSongAudio.currentTime = time;
  //     setCurrentTime(time);
  //     currentSongAudio.play();
  //   }
  // };  

  return (
    <div>
      <div>
        <Navbar setSearchQuery={setSearchQuery}/>
        <div className={styles.homeSongsContainer}>
          <p>Songs...</p>
          <hr />
          {songs.map((song, index) => (
            <div key={song._id} className={styles.songItem}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div>{index + 1}</div>
                <img src={song.albumCover} alt="" className={styles.songAlbumCover}/>
                <div>
                  <strong>{song.name}</strong>
                  <p>{song.artist}</p>
                </div>
              </div>

              <i className={`fa-solid ${currentSongData.isPlaying && currentSongData._id === song._id ? "fa-pause" : "fa-play"}`} onClick={() => playSong(song)} style={{ cursor: "pointer" }}></i>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.stickyBottom}>
        <div style={{display: "flex", gap: "0.7em"}}>
          <img src={currentSongData.albumCover} alt="currently-playing-song" style={{ width: "5em" }}/>
          <div style={{width: "6em"}} className={styles.white}>
            <strong>{currentSongData.name}</strong>
            <p>{currentSongData.artist}</p>
          </div>
        </div>
        <div className={styles.audioControlIconsContainer}>
          <i style={{ cursor: "pointer" }} className="fa-solid fa-backward-step" onClick={() => rewindSong(currentSongData)}></i>
          <i style={{ cursor: "pointer" }} className={`fa-solid ${currentSongData.isPlaying ? "fa-pause" : "fa-play"}`} onClick={() => playSong(currentSongData)}></i>
          <i style={{ cursor: "pointer" }} className="fa-solid fa-forward-step" onClick={() => skipSong(currentSongData)}></i>
        </div>
        <div style={{ paddingRight: "3em"}}>
          <i style={{color: "white", cursor: "pointer"}} className={`fa-heart ${currentSongData.isLiked ? "fa-solid" : "fa-regular"}`} onClick={() => toggleLike(currentSongData)}></i>
      </div>
      </div>
    </div>
  )
}
