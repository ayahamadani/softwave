import { React, useState, useEffect, useContext } from 'react';
import SongContext from '../../components/context/SongContext';
import { Link } from "react-router-dom";
import axios from 'axios';
import Loader from '../../components/Loader/Loader';
import styles from "./Playlists.module.css";

export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(SongContext);

  useEffect(() => {
    if (user) {
      axios.get(`https://softwave-music-player.onrender.com/playlists/user/${user.userId}`)
        .then((res) => {
          setPlaylists(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, []);

  const handleDeletePlaylist = async (playlistId) => {
  if (!window.confirm("Are you sure you want to delete this playlist?")) return;

  try {
    const user = JSON.parse(localStorage.getItem("user"));
    await axios.delete(`http://localhost:5000/playlists/${user.userId}/${playlistId}`);
    
    // Refresh playlist state
    setPlaylists(prev => prev.filter(pl => pl._id !== playlistId));
  } catch (err) {
    console.error("Failed to delete playlist:", err);
    alert("Something went wrong while deleting the playlist.");
  }
};


return (
    <div style={{ padding: "8em 4em" }}>
      {playlists.length > 0 ? (
        <>
          <p>Playlists</p>
          <hr style={{ margin: "0.5em 0em", width: "100%", border: "1px solid #eee" }} />
          <div style={{ display: "flex", flexDirection: "row", gap: "1em", width: "100%", flexWrap: "wrap" }}>
            {playlists.map((playlist) => (
              <div
                key={playlist._id}
                style={{
                  height: "18em",
                  width: "15em",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  margin: "1em",
                  cursor: "pointer",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <Link
                  to={`/playlists/${encodeURIComponent(playlist._id)}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <img
                    src={playlist.playlistIcon}
                    alt=""
                    style={{ width: "100%", borderRadius: "15px", height: "12em", objectFit: "cover" }}
                  />
                </Link>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.5em" }}>
                  <h3 style={{ fontSize: "1em", margin: 0 }}>{playlist.name}</h3>
                  <i
                    className="fa-solid fa-trash"
                    style={{ paddingLeft: "0.5em", cursor: "pointer", color: "rgb(155, 89, 182)" }}
                    onClick={() => handleDeletePlaylist(playlist._id)}
                  />
                </div>
                <p style={{ color: "gray", fontSize: "0.9em" }}>{playlist.songs.length} song(s)</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <h2 style={{ marginTop: "2em" }}>You have no playlists for now...</h2>
      )}
    </div>
  );
}
