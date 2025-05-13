import {React, useState, useRef, useEffect, useContext } from 'react';
import styles from './Navbar.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SongContext from '../../components/context/SongContext';

export default function Navbar({ setSearchQuery }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const iconContainerRef = useRef();
  const inputRef = useRef();
  const user = JSON.parse(localStorage.getItem("user"));
  const { userIcon, setUserIcon } = useContext(SongContext);

  const handleInputChange = (e) => {
    setSearchQuery(inputRef.current.value);
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  // Hide dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          iconContainerRef.current && !iconContainerRef.current.contains(e.target)) {
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

  useEffect(() => {
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
        <Link to="/home" className={styles.navbarBrand}>Softwave</Link>
        <input 
          type="text" 
          placeholder='Search for a song' 
          onChange={handleInputChange} 
          ref={inputRef} 
          className={styles.searchInput}
        />
      </div>

      <div className={styles.rightNav}>
        <div className={styles.navLinks}>
          <Link to="/home" className={styles.navLink}>Home</Link>
          <Link to="/likedSongs" className={styles.navLink}>Liked Songs</Link>
          <Link to="/playlists" className={styles.navLink}>Playlists</Link>
        </div>
        <div 
          className={styles.iconContainer} 
          ref={iconContainerRef}
          onClick={toggleDropdown}
        >
          <img
            src={userIcon || '/default-user-icon.png'}
            alt="User profile"
            className={styles.userIcon}
          />

          {showDropdown && (
            <div className={styles.dropdownMenu} ref={dropdownRef}>
              <Link to="/profile" className={styles.dropdownLink}>
                <div className={styles.dropdownItem}>Profile</div>
              </Link>
              {user.isAdmin && (
                <Link to="/adminPanel" className={styles.dropdownLink}>
                  <div className={`${styles.dropdownItem} ${styles.adminItem}`}>Admin Panel</div>
                </Link>
              )}
              <div className={styles.dropdownItem} onClick={handleLogout}>Logout</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}