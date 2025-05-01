import { React, useEffect, useState, useContext } from 'react';
import SongContext from '../../components/context/SongContext';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import styles from './Home.module.css';
import image from "../../components/assets/images/download.jpg";
import { Link } from 'react-router-dom';

export default function Home() {
  const {
      currentSongData,
      playSong,
      songs,
      setSongs,
      searchQuery,
    } = useContext(SongContext);

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
              <div style={{ paddingRight: "0.5em"}}>
                <i className={`fa-solid ${currentSongData.isPlaying && currentSongData._id === song._id ? "fa-pause" : "fa-play"}`} onClick={() => playSong(song)} style={{ cursor: "pointer" }}></i>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "10%", justifyContent: "center", width: "50%"}}>
          <Link to="/likedSongs" style={{ cursor: "pointer", textDecoration: "none", color: "black"}}>
            <img src={image} alt="liked-songs-collection-cover" style={{borderRadius: "15px", width: "13em", cursor: "pointer"}}/>
            <p style={{ cursor: "pointer", textDecoration: "none"}}>Liked Songs</p>
          </Link>
          <Link to="/playlists" style={{ cursor: "pointer", textDecoration: "none", color: "black"}}>
            <img src={image} alt="liked-songs-collection-cover" style={{borderRadius: "15px", width: "13em", cursor: "pointer"}}/>
            <p >Playlists</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
