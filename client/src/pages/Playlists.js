import {React, useState, useEffect } from 'react'
import Navbar from '../components/Navbar/Navbar';
import BottomPlayer from '../components/BottomPlayer/BottomPlayer';
import { Link } from "react-router-dom";
import axios from 'axios';

import image from "../components/assets/images/download.jpg";

export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
      const user = JSON.parse(localStorage.getItem("user"));
      axios.get(`http://localhost:5000/playlists/user/${user.userId}`)
      .then((res) => {
        setPlaylists(res.data);
      });
  }, []);

  return (
    <div style={{ padding: "0em 4em"}}>
    {playlists.length > 0 ? (
      <>
        <p>Playlists</p>
        <hr style={{ margin: "0.5em 0em", width: "50%" }}/>
        <div style={{ display: "flex", flexDirection: "row", gap: "1em", width: "100%" }}>
          {playlists.map((playlist, index) => (
           <Link
            to={`/playlists/${encodeURIComponent(playlist.name)}`}
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
            <img src={image} alt="" style={{ width: "80%", borderRadius: "15px", height: "80%", objectFit: "cover" }} />
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
