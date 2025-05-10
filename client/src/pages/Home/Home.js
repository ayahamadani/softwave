import { React, useEffect, useState, useContext } from 'react';
import SongContext from '../../components/context/SongContext';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import styles from './Home.module.css';
import likedSongsCover from "../../components/assets/images/likedSongs.jpg";
import playlistsCover from "../../components/assets/images/playlists.jpg"
import { Link } from 'react-router-dom';

export default function Home() {
  const {
      currentSongData,
      playSong,
      songs,
      setSongs,
      searchQuery,
      likedSongsFront
    } = useContext(SongContext);

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      axios
        .get(`http://localhost:5000/songs/search?name=${encodeURIComponent(searchQuery)}`)
        .then((res) => {
          const songList = res.data.map(song => ({
            ...song,
            isPlaying: false,
            isLiked: false
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
            isPlaying: false,
            isLiked: false
          }));
          setSongs(songList);
        })
        .catch((err) => console.error("Failed to fetch songs:", err));
    }
  }, [searchQuery, setSongs]);

  useEffect(() => {
    const fetchAllSongs = async () => {
      const res = await axios.get("http://localhost:5000/songs");
      const allSongs = res.data;
  
      const updatedSongs = allSongs.map(song => ({
        ...song,
        isLiked: likedSongsFront.some(liked => liked._id === song._id),
      }));
  
      setSongs(updatedSongs);
    };
  
    fetchAllSongs();
  }, [likedSongsFront, setSongs]);
  

  return (
    <div className={styles.homeContainer}>
      <div className={styles.homeContentWrapper}>
        <div className={styles.homeSongsContainer}>
          <p className={styles.sectionTitle}>Songs...</p>
          <hr className={styles.divider} />
          {songs.map((song, index) => (
            <div key={song._id} className={styles.songItem}>
              <div className={styles.songInfo}>
                <div className={styles.songIndex}>{index + 1}</div>
                <img 
                  src={song.albumCover} 
                  alt={song.name} 
                  className={styles.songAlbumCover}
                />
                <div className={styles.songDetails}>
                  <strong className={styles.songName}>{song.name}</strong>
                  <p className={styles.songArtist}>{song.artist}</p>
                </div>
              </div>
              <div className={styles.songControls}>
                <i 
                  className={`fa-solid ${
                    currentSongData.isPlaying && currentSongData._id === song._id 
                      ? "fa-pause" 
                      : "fa-play"
                  } ${styles.playButton}`} 
                  onClick={() => playSong(song, songs)} 
                />
              </div>
            </div>
          ))}
        </div>
        <div className={styles.featuredContent}>
          <Link 
            to="/likedSongs" 
            className={styles.featuredLink}
          >
            <img 
              src={likedSongsCover} 
              alt="Liked songs collection" 
              className={styles.featuredImage}
            />
            <p className={styles.featuredTitle}>Liked Songs</p>
          </Link>
          <Link 
            to="/playlists" 
            className={styles.featuredLink}
          >
            <img 
              src={playlistsCover} 
              alt="Playlists collection" 
              className={styles.featuredImage}
            />
            <p className={styles.featuredTitle}>Playlists</p>
          </Link>
        </div>
      </div>
    </div>
  )
}