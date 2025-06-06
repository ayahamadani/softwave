import { useEffect, useContext } from 'react';
import SongContext from '../../components/context/SongContext';
import axios from "axios";
import styles from "./likedSongs.module.css";

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
    }, [searchQuery, setLikedSongsFront, currentSongData]);


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
      </div>
    );
}