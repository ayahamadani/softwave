import {React, useState, useRef, useEffect, useContext } from 'react';
import styles from '../../pages/Home/Home.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SongContext from '../../components/context/SongContext';

export default function Navbar({ setSearchQuery }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const inputRef = useRef();
  const user = JSON.parse(localStorage.getItem("user"));
  const { userIcon, setUserIcon } = useContext(SongContext);

  const handleInputChange = (e) => {
    setSearchQuery(inputRef.current.value);
  };

  // Hide dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user.userId;
    axios
    .get(`https://softwave-music-player.onrender.com/auth/${userId}`)
    .then((res) => {
      setUserIcon(res.data.icon);
    })
    .catch((err) => console.error("Failed to fetch Icon", err));
  }, []);

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.leftNav}>
        <Link to="/home" style={{ color: "white"}}><h1>Softwave</h1></Link>
        <input type="text" placeholder='search for a song' onChange={handleInputChange} ref={inputRef} id="navbarSearchInput"/>
      </div>

      <div className={styles.rightNav}>
        <div>
          <Link to="/home" style={{ color: "white"}}>Home</Link>
          <Link to="/likedSongs" style={{ color: "white"}}>Liked Songs</Link>
          <Link to="/playlists" style={{ color: "white"}}>Playlists</Link>
        </div>
        <div className={styles.iconContainer}>
          <img
            src={userIcon || null}
            alt="user-icon"
            onClick={() => setShowDropdown((prev) => !prev)}
            style={{ cursor: "pointer" }}
          />

          {showDropdown && (
            <div className={styles.dropdownMenu} ref={dropdownRef}>
              <Link to="/profile" style={{ margin: "0px"}}><div className={styles.dropdownItem}>Profile</div></Link>
              {user.isAdmin ? <Link to="/adminPanel" style={{ margin: "0px"}}><div className={styles.dropdownItem} style={{ color: "purple"}}>Admin Panel</div></Link> : ""}
              <div className={styles.dropdownItem} onClick={handleLogout}>Logout</div>
            </div>
          )}
        </div>
      </div>
  </div>
  )
}
