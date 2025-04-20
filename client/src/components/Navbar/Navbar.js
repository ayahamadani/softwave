import React from 'react';
import styles from '../../pages/Home/Home.module.css';
import { Link } from 'react-router-dom';
import userIcon from "../assets/images/download.jpg";
import LikedSongs from '../../pages/LikedSongs';

export default function Navbar({ setSearchQuery }) {

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.leftNav}>
        <h1>Soundwave</h1>
        <input type="text" placeholder='search for a song' onChange={handleInputChange}/>
      </div>

      <div className={styles.rightNav}>
        <div>
          <Link to="/home">Home</Link>
          <Link to="/likedSongs">Liked Songs</Link>
          <Link to="/playlists">Playlists</Link>
        </div>
        <div className={styles.iconContainer}>
          <img src={userIcon} alt="user-icon" />
        </div>
      </div>
  </div>
  )
}
