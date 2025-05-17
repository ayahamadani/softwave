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

  const { userIcon, setUserIcon, user } = useContext(SongContext);

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

  const goToLogin = () => {
    window.location.href = "/login";
  }

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.leftNav}>
        <Link to="/" className={styles.navbarBrand}>Softwave</Link>
        <input 
          type="text" 
          placeholder='Search for a song' 
          onChange={handleInputChange} 
          ref={inputRef} 
          className={styles.searchInput}
        />
      </div>

      <div className={styles.rightNav}>

       {!user ? (
        <button
          onClick={goToLogin}
          style={{
            width: "150px",
            borderRadius: "8px",
            border: "2px solid purple",
            color: "purple",
            backgroundColor: "white",
            padding: "0.5em 1em",
            cursor: "pointer",
            fontWeight: 500,
            transition: "all 0.2s ease"
          }}
        >
          Log In
        </button>
      ) : null}

        <div className={styles.navLinks}>
          <Link to="/" className={styles.navLink}>Home</Link>
          <Link to="/likedSongs" className={styles.navLink}>Liked Songs</Link>
          <Link to="/playlists" className={styles.navLink}>Playlists</Link>
        </div>
        <div 
          className={styles.iconContainer} 
          ref={iconContainerRef}
          onClick={toggleDropdown}
        >
          <img
            src={userIcon}
            alt="User profile"
            className={styles.userIcon}
          />

          {showDropdown && (
            <div className={styles.dropdownMenu} ref={dropdownRef}>
              <Link to="/profile" className={styles.dropdownLink}>
                <div className={styles.dropdownItem}>Profile</div>
              </Link>
              {user && user.isAdmin && (
                <Link to="/adminPanel" className={styles.dropdownLink}>
                  <div className={`${styles.dropdownItem} ${styles.adminItem}`}>Admin Panel</div>
                </Link>
              )}
              <div style={user ? {display: "block"} : {display: "none"} } className={styles.dropdownItem} onClick={handleLogout}>Logout</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}