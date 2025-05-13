import { React, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import Loader from '../components/Loader/Loader';

export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    axios.get(`https://softwave-music-player.onrender.com/playlists/user/${user.userId}`)
      .then((res) => {
        setPlaylists(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="playlists-page">
      <div className="playlists-header">
        <h1>Your Playlists</h1>
        <div className="divider"></div>
      </div>
      
      {playlists.length > 0 ? (
        <div className="playlists-grid">
          {playlists.map((playlist) => (
            <Link
              to={`/playlists/${encodeURIComponent(playlist._id)}`}
              key={playlist._id}
              className="playlist-card"
            >
              <div className="image-container">
                <img 
                  src={playlist.playlistIcon || '/default-playlist.png'} 
                  alt={playlist.name}
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = '/default-playlist.png';
                  }}
                />
              </div>
              <div className="playlist-info">
                <h3>{playlist.name}</h3>
                <p>{playlist.songs?.length || 0} {playlist.songs?.length === 1 ? 'song' : 'songs'}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>You don't have any playlists yet</p>
          <Link to="/create-playlist" className="create-btn">
            Create your first playlist
          </Link>
        </div>
      )}
    </div>
  );
}