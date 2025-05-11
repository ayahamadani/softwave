import {React, useState, useEffect, useContext } from 'react'
import { Link } from "react-router-dom";
import axios from 'axios';
import Loader from '../components/Loader/Loader';

export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
      const user = JSON.parse(localStorage.getItem("user"));
      axios.get(`https://softwave-music-player.onrender.com/playlists/user/${user.userId}`)
      .then((res) => {
        setPlaylists(res.data);
      });
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
      <Loader />
    )}
  </div>
  )
}
