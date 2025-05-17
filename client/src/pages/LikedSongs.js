import React, { useState, useEffect, useContext } from 'react';
import BottomPlayer from '../components/BottomPlayer/BottomPlayer';
import SongContext from '../components/context/SongContext';
import axios from "axios";
import styles from "../components/assets/likedSongs.module.css";

export default function LikedSongs() {
    const { 
        currentSongData,
        playSong,
        searchQuery,
        likedSongsFront,
        setLikedSongsFront
    } = useContext(SongContext);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;

        const fetchLikedSongs = async () => {
            try {
                const res = await axios.get(`https://softwave-music-player.onrender.com/likedsongs/${user.userId}`);
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

   useEffect(() => {
    if (likedSongsFront.length > 0) {
      const targetSongId = likedSongsFront[likedSongsFront.length - 1]._id;
      const ids = likedSongsFront.map(s => s._id).join(',');
      
     const fetchRecommendations = async () => {
  try {
    const response = await fetch('http://localhost:5000/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ songIds: ids })
    });

    // Log the response text to inspect it
    const textResponse = await response.text();

    // Try to parse if it's valid JSON
    const data = JSON.parse(textResponse);

    if (response.ok) {
      setRecommendations(data.slice(0, 2)); // Limit to 2 results
    } else {
      console.error('Error fetching recommendations:', data);
    }
  } catch (error) {
    console.error('Error fetching recommendations:', error);
  } finally {
    setLoading(false);
  }
};


      fetchRecommendations();
    }
  }, [likedSongsFront]);


    return (
      <div className={styles.homeContainer}>
        {/* Liked Songs Section */}
        <div className={styles.homeSongsContainer}>
            <h2>Liked Songs</h2>
            <hr className={styles.divider} />
            {likedSongsFront.length > 0 ? likedSongsFront.map((song, index) => (
                <div key={song._id} className={styles.songItem}>
                    <div className={styles.songInfo}>
                        <div className={styles.songIndex}>{index + 1}</div>
                        <img src={song.albumCover} alt="" className={styles.songAlbumCover} />
                        <div className={styles.songDetails}>
                            <strong className={styles.songName}>{song.name}</strong>
                            <p className={styles.songArtist}>{song.artist}</p>
                        </div>
                    </div>

                    <i 
                        className={`fa-solid ${currentSongData.isPlaying && currentSongData._id === song._id ? "fa-pause" : "fa-play"} ${styles.playButton}`}
                        onClick={() => playSong(song, likedSongsFront)} 
                    />
                </div>
            )) : (
                <div className={styles.emptyState}>
                    <h2>You have no Liked songs so far</h2>
                </div>
            )}
        </div>

        {/* Recommendations Section - Now with matching styling */}
        <div className={styles.homeSongsContainer}>
            <h2>Recommended Songs</h2>
            <hr className={styles.divider} />
            {loading ? (
                <div className={styles.loadingState}>
                    <p>Loading recommendations...</p>
                </div>
            ) : recommendations.length > 0 ? (
                recommendations.map((song, index) => (
                    <div key={song._id} className={styles.songItem}>
                        <div className={styles.songInfo}>
                            <div className={styles.songIndex}>{index + 1}</div>
                            <img src={song.albumCover} alt="" className={styles.songAlbumCover} />
                            <div className={styles.songDetails}>
                                <strong className={styles.songName}>{song.name}</strong>
                                <p className={styles.songArtist}>{song.artist}</p>
                            </div>
                        </div>

                        <i 
                            className={`fa-solid ${currentSongData.isPlaying && currentSongData._id === song._id ? "fa-pause" : "fa-play"} ${styles.playButton}`}
                            onClick={() => playSong(song, recommendations)} 
                        />
                    </div>
                ))
            ) : (
                <div className={styles.emptyState}>
                    <p>No recommendations available</p>
                </div>
            )}
        </div>
      </div>
    );
}