import { React, useEffect, useState, useContext } from 'react';
import SongContext from '../context/SongContext';
import styles from '../../pages/Home/Home.module.css';

export default function BottomPlayer() {
    const { currentSongData, setCurrentSongData, playSong, currentSongAudio, setCurrentSongAudio, rewindSong, songs, setSongs, getSongIndex, skipSong, toggleLike } = useContext(SongContext);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (!currentSongAudio) return;
    
        const updateTime = () => {
          setCurrentTime(currentSongAudio.currentTime);
          setDuration(currentSongAudio.duration || 0);
        };
    
        currentSongAudio.addEventListener("timeupdate", updateTime);
        currentSongAudio.addEventListener("loadedmetadata", updateTime);
    
        return () => {
          currentSongAudio.removeEventListener("timeupdate", updateTime);
          currentSongAudio.removeEventListener("loadedmetadata", updateTime);
        };
      }, [currentSongAudio]);

      const handleSeek = (e) => {
        const seekTime = parseFloat(e.target.value);
        currentSongAudio.currentTime = seekTime;
        setCurrentTime(seekTime);
      };
    
      const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
      };

    return (
      <div className={styles.stickyBottom}>
        <div style={{display: "flex", gap: "0.7em"}}>
            <img src={currentSongData.albumCover} alt="currently-playing-song" style={{ width: "5em" }}/>
            <div style={{width: "6em"}} className={styles.white}>
            <strong>{currentSongData.name}</strong>
            <p>{currentSongData.artist}</p>
            </div>
        </div>
        <div style={{width: "30em"}}>
            <div className={styles.audioControlIconsContainer}>
                <i style={{ cursor: "pointer" }} className="fa-solid fa-backward-step" onClick={() => rewindSong(currentSongData)}></i>
                <i style={{ cursor: "pointer" }} className={`fa-solid ${currentSongData.isPlaying ? "fa-pause" : "fa-play"}`} onClick={() => playSong(currentSongData)}></i>
                <i style={{ cursor: "pointer" }} className="fa-solid fa-forward-step" onClick={() => skipSong(currentSongData)}></i>
            </div>
            <div className={styles.progressContainer}>
                <span style={{color: "white"}}>{formatTime(currentTime)}</span>
                <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                step="0.1"
                onChange={handleSeek}
                className={styles.progressBar}
                />
                <span style={{color: "white"}}>{formatTime(duration)}</span>
            </div>
        </div>
        <div style={{ paddingRight: "3em"}}>
            <i className="fa-solid fa-plus" style={{color: "white", marginRight: "1em", cursor: "pointer"}}></i>
            <i style={{color: "white", cursor: "pointer"}} className={`fa-heart ${currentSongData.isLiked ? "fa-solid" : "fa-regular"}`} onClick={() => toggleLike(currentSongData)}></i>
        </div>
    </div>
    )
}
