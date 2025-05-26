import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import SongContext from '../../components/context/SongContext';
import axios from "axios";
import styles from "./PlaylistDetail.module.css";

export default function PlaylistDetail() {
  const { _id } = useParams();
  const [playlistSongs, setPlaylistSongs] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const fileInputRef = useRef();
  const { currentSongData, playSong, likedSongsFront, setCurrentQueue } = useContext(SongContext);

  useEffect(() => {
    const fetchPlaylist = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      try {
        const res = await axios.get(`https://softwave-music-player.onrender.com/playlists/user/${user.userId}`);
        const found = res.data.find((p) => p._id === _id);
        setPlaylist(found);
        const songList = found.songs.map(song => ({
          ...song,
          isPlaying: false,
          isLiked: likedSongsFront.some(liked => liked._id === song._id),
        }));
        setPlaylistSongs(songList);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPlaylist();
  }, [_id, likedSongsFront]);

  if (!playlistSongs) return <div className={styles.loadingState}>Loading playlist...</div>;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("playlistCover", file);
  
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.post(
        `https://softwave-music-player.onrender.com/upload/${user.userId}/${playlist._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setPlaylist(response.data.playlist);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload playlist cover");
    }
  };

  const handleRemoveSong = async (songId) => {
  try {
    await axios.put(
      `http://localhost:5000/playlists/${playlist._id}/remove`,
      { songId }
    );

    setPlaylistSongs(prevSongs => prevSongs.filter(song => song._id !== songId));
  } catch (err) {
    console.error("Failed to remove song:", err);
    alert("Failed to remove the song from the playlist.");
  }
};

  return (
    <div className={styles.playlistDetailContainer}>
      <div className={styles.playlistHeader}>
        <div className={styles.coverContainer}>
          <img 
            src={playlist.playlistIcon} 
            alt="playlist-icon" 
            className={styles.playlistCover}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-playlist.png';
            }}
          />
          <button 
            className={styles.changeCoverButton}
            onClick={() => fileInputRef.current.click()}
          >
            Change Playlist Cover
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className={styles.hiddenInput}
            onChange={handleFileChange}
          />
        </div>
        
        <div className={styles.playlistInfo}>
          <h2 className={styles.playlistTitle}>{playlist.name}</h2>
          <p className={styles.songCount}>{playlistSongs.length} {playlistSongs.length === 1 ? 'song' : 'songs'}</p>
        </div>
      </div>

      <div className={styles.songsList}>
        {playlistSongs.map((song, index) => (
          <div key={song._id} className={styles.songItem}>
            <div className={styles.songInfo}>
              <div className={styles.songIndex}>{index + 1}</div>
              <img 
                src={song.albumCover} 
                alt={song.name}
                className={styles.albumCover}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-album.png';
                }}
              />
              <div className={styles.songDetails}>
                <div className={styles.songName}>{song.name}</div>
                <div className={styles.songArtist}>{song.artist}</div>
              </div>
            </div>
            <i className="fa-solid fa-trash" style={{color: "#9b59b6", paddingRight: "0.5em", cursor: "pointer"}} onClick={() => handleRemoveSong(song._id)}></i>
            <button 
              className={styles.playButton}
              onClick={() => playSong(song, playlistSongs)}
            >
              <i className={`fa-solid ${
                currentSongData.isPlaying && currentSongData._id === song._id 
                  ? "fa-pause" 
                  : "fa-play"
              }`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}