import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import SongContext from '../../components/context/SongContext';
import styles from '../../pages/Home/Home.module.css';
import axios from "axios";

export default function PlaylistDetail() {
  const { _id } = useParams();
  const [playlistSongs, setPlaylistSongs] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const fileInputRef = useRef();
  const { currentSongData, playSong, likedSongsFront} = useContext(SongContext);


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
  }, [_id]);

  if (!playlistSongs) return <p style={{ padding: "2em"}}>Loading playlist...</p>;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("playlistCover", file);
  
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user.userId;
      const response = await axios.post(
        `https://softwave-music-player.onrender.com/upload/${userId}/${playlist._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setPlaylist(response.data.playlist);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload playlist cover");
    }
  };

  return (
    <div style={{ padding: "2em", marginLeft: "3em", display: "flex", flexDirection: "column" }}>
      <img src={playlist.playlistIcon} alt="playlist-icon" style={{width: "15em", height: "15em", borderRadius: "15px", objectFit: "cover"}}/>
      <button 
        style={{color: "purple", width: "13em", margin: "2em 1em", height: "2em", borderRadius: "15px", background: "none", cursor: "pointer"}} 
        onClick={() => fileInputRef.current.click()}
      >
        Change Playlist Cover
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <h2>{playlist.name}</h2>
      <p>{playlistSongs.length} song(s)</p>
       {playlistSongs.map((song, index) => (
            <div key={song._id} className={styles.songItem} style={{width: "50%"}}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div>{index + 1}</div>
                    <img src={song.albumCover} alt="" className={styles.songAlbumCover}/>
                    <div>
                    <strong>{song.name}</strong>
                    <p>{song.artist}</p>
                    </div>
                </div>
                <div style={{ paddingRight: "0.5em"}}>
                    <i className={`fa-solid ${currentSongData.isPlaying && currentSongData._id === song._id ? "fa-pause" : "fa-play"}`} onClick={() => playSong(song, playlistSongs)} style={{ cursor: "pointer" }}></i>
                </div>
            </div>
        ))}
    </div>
  );
}
