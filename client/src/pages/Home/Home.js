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
  // const [time, setTime] = useState({
  //   current: 0,
  //   duration: 0,
  //   remaining: 0,
  // });

  useEffect(() => {
    const fetchLikedSongs = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        console.error("User not found in localStorage");
        return;
      }
  
      try {
        // Fetch liked songs for the user
        const likedSongsRes = await axios.get(`http://localhost:5000/likedsongs/${user.userId}`);
        const likedSongIds = likedSongsRes.data.map(song => song._id); // Assuming liked songs are returned as an array of song objects
  
        // Now fetch all songs (with search if applicable)
        const songsRes = searchQuery.trim() !== ""
          ? await axios.get(`http://localhost:5000/songs/search?name=${encodeURIComponent(searchQuery)}`)
          : await axios.get("http://localhost:5000/songs");
  
        const songList = songsRes.data.map(song => ({
          ...song,
          isPlaying: false,
          isLiked: likedSongIds.includes(song._id), // Set isLiked to true if the song is in likedSongIds
        }));
  
        setSongs(songList); // Update the songs state
  
      } catch (err) {
        console.error("Error fetching liked songs:", err);
      }
    };
  
    fetchLikedSongs();
  }, [searchQuery, setSongs]);
  

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
