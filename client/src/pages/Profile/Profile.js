import { React, useRef, useContext } from 'react';
import styles from './Profile.module.css';
import SongContext from '../../components/context/SongContext';
import axios from 'axios';

export default function Profile() {
  const { userIcon, setUserIcon } = useContext(SongContext);
  const user = JSON.parse(localStorage.getItem("user"));
  const fileInputRef = useRef();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const userId = user.userId;
      const response = await axios.post(
        `http://localhost:5000/upload/${userId}/upload-avatar`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const newAvatarUrl = response.data.avatarUrl;
      setUserIcon(newAvatarUrl);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <h2>Profile</h2>
      <hr className={styles.divider} />
      
      <div className={styles.avatarContainer}>
        <div className={styles.avatarImageContainer}>
          <img 
            src={userIcon || null} 
            alt="user-icon" 
            className={styles.avatarImage} 
          />
        </div>
        
        <button
          onClick={() => fileInputRef.current.click()}
          className={styles.changeAvatarButton}
        >
          Change Avatar
        </button>
      </div>
      
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      
      <div className={styles.userInfoContainer}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Username:</span>
          <span>{user.username}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>User Type:</span>
          <span className={user.isAdmin ? styles.adminText : ''}>
            {user.isAdmin ? "Admin" : "Normal User"}
          </span>
        </div>
      </div>
    </div>
  );
}