import React, { Component, useState, useEffect, useContext } from 'react';
import BottomPlayer from '../components/BottomPlayer/BottomPlayer';
import SongContext from '../components/context/SongContext';
import axios from "axios";
import Navbar from '../components/Navbar/Navbar';
import styles from './Home/Home.module.css';

export default function LikedSongs() {
    const { 
        currentSongData,
        playSong,
        searchQuery,
        likedSongsFront,
        setLikedSongsFront
     } = useContext(SongContext);


    
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;
      
        const fetchLikedSongs = async () => {
          try {
            // Get full song documents already populated by backend
            const res = await axios.get(`http://localhost:5000/likedsongs/${user.userId}`);
            const likedSongs = res.data
              .filter(song =>
                song.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
              )
              .map(song => ({
                ...song,
                isLiked: true,
                isPlaying: false,
              }));
      
             setLikedSongsFront(likedSongs);
          } catch (err) {
            console.error("Error fetching liked songs:", err);
          }
        };
      
        fetchLikedSongs();
      }, [searchQuery, setLikedSongsFront]);

    return (
      <div>
        <div className={styles.homeSongsContainer}>
            <p>Liked Songs...</p>
            <hr />
            {likedSongsFront.length > 0 ? likedSongsFront.map((song, index) => (
                <div key={song._id} className={styles.songItem}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div>{index + 1}</div>
                    <img src={song.albumCover} alt="" className={styles.songAlbumCover}/>
                    <div>
                    <strong>{song.name}</strong>
                    <p>{song.artist}</p>
                    </div>
                </div>

                <i className={`fa-solid ${currentSongData.isPlaying && currentSongData._id === song._id ? "fa-pause" : "fa-play"}`} onClick={() => playSong(song, likedSongsFront)} style={{ cursor: "pointer", paddingRight: "1em" }}></i>
                </div>
            )) : <div><h2 style={{marginTop: "1em"}}>You have no Liked songs so far</h2></div>}
        </div>
      </div>
    )
}
