import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import SongContext from '../../components/context/SongContext';
import styles from '../../pages/Home/Home.module.css';
import axios from "axios";

export default function PlaylistDetail() {
  const { name } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const { currentSongData, setCurrentSongData, playSong, currentSongAudio, setCurrentSongAudio, rewindSong, songs, setSongs, getSongIndex, skipSong, toggleLike, volume, setVolume } = useContext(SongContext);


  useEffect(() => {
    const fetchPlaylist = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      try {
        const res = await axios.get(`http://localhost:5000/playlists/user/${user.userId}`);
        const found = res.data.find((p) => p.name === name);
        setPlaylist(found);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPlaylist();
  }, [name]);

  if (!playlist) return <p style={{ padding: "2em"}}>Loading playlist...</p>;

  return (
    <div style={{ padding: "2em" }}>
      <h2>{playlist.name}</h2>
      <p>{playlist.songs.length} song(s)</p>
       {songs.map((song, index) => (
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
                    <i className={`fa-solid ${currentSongData.isPlaying && currentSongData._id === song._id ? "fa-pause" : "fa-play"}`} onClick={() => playSong(song)} style={{ cursor: "pointer" }}></i>
                </div>
            </div>
        ))}
    </div>
  );
}
