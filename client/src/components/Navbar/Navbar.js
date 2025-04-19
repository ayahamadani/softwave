import React from 'react';
import styles from "../Home/Home.module.css";
import userIcon from "../assets/images/download.jpg";

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
          <a href="#">Home</a>
          <a href="#">Liked Songs</a>
          <a href="#">Playlists</a>
        </div>
        <div className={styles.iconContainer}>
          <img src={userIcon} alt="user-icon" />
        </div>
      </div>
  </div>
  )
}
