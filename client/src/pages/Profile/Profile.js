import { React, useEffect, useState, useContext } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import SongContext from '../../components/context/SongContext';

export default function Profile() {
    const { currentSongData, setCurrentSongData, playSong, currentSongAudio, setCurrentSongAudio, rewindSong, songs, setSongs, getSongIndex, skipSong, toggleLike } = useContext(SongContext);
    const user = JSON.parse(localStorage.getItem("user"));
    const [searchQuery, setSearchQuery] = useState("");

  return (
      <div>
        <div style={{ marginLeft: "3em", gap: "1em", display: "flex", flexDirection: "column" }}>
            <p>Profile...</p>
            <hr style={{ width: "50%"}}/>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>User Type:</strong> { user.isAdmin ? "Admin " : "Normal"}</p>
        </div>
    </div>
  )
}
