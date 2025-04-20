import { React, useEffect, useState, useContext } from 'react';
import SongContext from '../../components/context/SongContext';
import BottomPlayer from '../../components/BottomPlayer/BottomPlayer';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import styles from './Home.module.css';
import image from "../../components/assets/images/download.jpg";
import { Link } from 'react-router-dom';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const { currentSongData, setCurrentSongData, playSong, currentSongAudio, setCurrentSongAudio, rewindSong, songs, setSongs, getSongIndex, skipSong, toggleLike } = useContext(SongContext);
  // const [time, setTime] = useState({
  //   current: 0,
  //   duration: 0,
  //   remaining: 0,
  // });

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
  }, [searchQuery, setSongs]);

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
      <Navbar setSearchQuery={setSearchQuery}/>
      <div style={{display: "flex"}}>
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
        <div>
          <Link to="/likedSongs">
            <img src={image} alt="liked-songs-collection-cover" style={{borderRadius: "15px", width: "13em", cursor: "pointer"}}/>
            <p style={{ cursor: "pointer", textDecoration: "none"}}>Liked Songs</p>
          </Link>
        </div>
      </div>
      <BottomPlayer />
    </div>
  )
}
