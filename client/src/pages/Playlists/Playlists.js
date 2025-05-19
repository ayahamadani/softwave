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

 return (
    <div style={{ padding: "8em 4em"}}>
    {playlists.length > 0 ? (
      <>
        <p>Playlists</p>
        <hr style={{margin: "0.5em 0em", width: "100%", border: "1px solid #eee"}}/>
        <div style={{ display: "flex", flexDirection: "row", gap: "1em", width: "100%" }}>
          {playlists.map((playlist) => (
           <Link
            to={`/playlists/${encodeURIComponent(playlist._id)}`}
            key={playlist._id}
            style={{
              height: "15em",
              width: "15em",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              margin: "1em",
              cursor: "pointer",
              textDecoration: "none",
              color: "inherit"
            }}
          >
            <img src={playlist.playlistIcon} alt="" style={{ width: "80%", borderRadius: "15px", height: "80%", objectFit: "cover" }} />
            <h3>{playlist.name}</h3>
            <p style={{ color: "gray" }}>{playlist.songs.length} song(s)</p>
          </Link>
          ))}
        </div>
      </>
    ) : (
      <h2 style={{ marginTop: "2em" }}>You have no playlists for now...</h2>
    )}
  </div>
  )
}
