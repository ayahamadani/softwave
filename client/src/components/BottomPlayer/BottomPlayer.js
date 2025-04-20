import { React, useEffect, useState, useContext } from 'react';
import SongContext from '../context/SongContext';
import styles from '../../pages/Home/Home.module.css';

export default function BottomPlayer() {
    const { currentSongData, setCurrentSongData, playSong, currentSongAudio, setCurrentSongAudio, rewindSong, songs, setSongs, getSongIndex, skipSong, toggleLike } = useContext(SongContext);

    return (
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
    )
}
