import React, { Component, useState, useEffect, useContext } from 'react';
import BottomPlayer from '../components/BottomPlayer/BottomPlayer';
import SongContext from '../components/context/SongContext';
import axios from "axios";
import Navbar from '../components/Navbar/Navbar';
import styles from './Home/Home.module.css';

export default function LikedSongs() {
    const { 
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
        loading,
        setLoading
     } = useContext(SongContext);
    const [likedSongs, setLikedSongs] = useState([]);


    useEffect(() => {
        
        if (searchQuery.trim() !== "") {
            axios
                .get(`http://localhost:5000/songs/liked/search?name=${encodeURIComponent(searchQuery)}`)
                .then((res) => {
                    const songList = res.data.map(song => ({
                        ...song,
                        isPlaying: false
                    }));
                    setLikedSongs(songList);
                    setSongs(likedSongs);
                })
                .catch((err) => console.error("Search failed:", err));
        } else {
            axios
                .get("http://localhost:5000/songs/liked")
                .then((response) => {
                    setLikedSongs(response.data);
                    setSongs(likedSongs);
                })
                .catch((error) => {
                    console.error("Error fetching liked songs:", error);
                });
        }
    }, [searchQuery, toggleLike]);
    
    
    return (
      <div>
        <div className={styles.homeSongsContainer}>
            <p>Liked Songs...</p>
            <hr />
            {likedSongs.length > 0 ? likedSongs.map((song, index) => (
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
            )) : <div><h2 style={{marginTop: "1em"}}>You have no Liked songs so far</h2></div>}
        </div>
      </div>
    )
}
