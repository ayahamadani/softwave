import { useEffect, useState, useContext, useRef } from 'react';
import styles from "./AdminPanel.module.css";
import SongContext from '../../components/context/SongContext';
import axios from 'axios';

export default function AdminPanel() {
    const [image, setImage] = useState(null);
    const [songFile, setSongFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [songName, setSongName] = useState("");
    const [artist, setArtist] = useState("");
    const [genre, setGenre] = useState("");
    const [users, setUsers] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const songFileRef = useRef(null);
    const imageFileRef = useRef(null);



    const { 
     user
   } = useContext(SongContext);

   const handleImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        setImage(URL.createObjectURL(file));
        console.log(file); // for preview
        setImageFile(file); // for uploading
      }
    };

    const handleSongFile = (event) => {
      const file = event.target.files[0];
      if (file) {
        setSongFile(file);
        console.log("Selected song file:", file);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const userId = user._id;
    
      const formData = new FormData();
      formData.append("songName", songName);
      formData.append("artist", artist);
      formData.append("genre", genre);
      formData.append("albumCover", imageFile);
      formData.append("songFile", songFile);
    
      try {
        const response = await axios.post(
          `https://softwave-music-player.onrender.com/upload/${userId}/upload-song`, 
          formData, 
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
    
        console.log("Song uploaded:", response.data.song);
        setSongName("");
        setArtist("");
        setGenre("");
        setImage(null);
        setSongFile(null);
        setImageFile(null);
        if (songFileRef.current) songFileRef.current.value = "";
        if (imageFileRef.current) imageFileRef.current.value = "";
      } catch (err) {
        console.error("Upload failed:", err.response?.data || err.message);
      }
    };

    useEffect(() => {
      const fetchUsers = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;
    
        try {
          const res = await axios.get("https://softwave-music-player.onrender.com/auth");
          console.log(res.data);
          const fetchedUsers = res.data.filter(item => item.username !== user.username.toLowerCase());
          setUsers(fetchedUsers);
          setFilteredUsers(fetchedUsers);
        } catch (err) {
          console.error("Error fetching users:", err);
        }
      };
    
      fetchUsers();
    }, []);

    useEffect(() => {
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredUsers(filtered);
    }, [searchInput, users]);

    
    const toggleAdmin = async (userId) => {
      try{
        await axios.put(`https://softwave-music-player.onrender.com/auth/${userId}/makeAdmin`);
        const res = await axios.get("https://softwave-music-player.onrender.com/auth");
        setUsers(res.data);
        } catch (err) {
          console.error("Error toggling Adminship", err);
      }
    }
    const deleteUser = async (userId) => {
    try {
      await axios.delete(`https://softwave-music-player.onrender.com/auth/${userId}`);
      // Remove the deleted user from state to update UI
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      setFilteredUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err.response?.data || err.message);
    }
  };


  
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.formTitle}>Upload New Song</h2>
          
          <input 
            type="text" 
            placeholder="Song name" 
            value={songName} 
            onChange={(e) => setSongName(e.target.value)} 
            className={styles.inputField}
          />
          
          <input 
            type="text" 
            placeholder="Artist" 
            value={artist} 
            onChange={(e) => setArtist(e.target.value)} 
            className={styles.inputField}
          />
          
          <select 
            value={genre} 
            onChange={(e) => setGenre(e.target.value)}
            className={styles.selectField}
          >
            <option value="" disabled>Genre</option>
            <option value="Jazz">Jazz</option>
            <option value="Japanese">Japanese</option>
            <option value="Classical">Classical</option>
            <option value="Spanish">Spanish</option>
            <option value="Video Games">Video Games</option>
          </select>

          <label htmlFor="albumCover" className={styles.fileInputLabel}>Album Cover</label>
          <input 
            type="file" 
            id="albumCover" 
            accept="image/*" 
            onChange={handleImageChange}
            className={styles.fileInput}
            ref={imageFileRef}
          />

          <label htmlFor="songFile" className={styles.fileInputLabel}>Song File</label>
          <input 
            type="file" 
            id="songFile" 
            accept="audio/*" 
            onChange={handleSongFile}
            className={styles.fileInput}
            ref={songFileRef}
          />
          
          <button type="submit" className={styles.submitButton}>Upload</button>
        </form>
      </div>
      
      <div className={styles.adminPanel}>
        <div>
          <p className={styles.adminTitle}>Make user an admin...</p>
          <hr style={{margin: "0.5em 0em", width: "100%", border: "1px solid #eee"}}/>
        </div>
        
        <div style={{display: "flex", flexDirection: "column-reverse"}}>
          {users.length > 0 ? (
            <div className={styles.usersGrid}>
              {filteredUsers.map((user) => (
                <div key={user._id} className={styles.userCard}>
                  <img src={user.icon} alt="user-icon" className={styles.userIcon} />
                  <h3 className={styles.userName}>{user.username}</h3>
                  <p className={styles.userRole}>{user.isAdmin ? "Admin" : "Normal"} User</p>
                  <div style={{display: "flex", justifyContent: "center", flexDirection: "column", gap: "1em"}}>
                    <button
                    onClick={() => toggleAdmin(user._id)} 
                    className={styles.adminToggleButton}
                  >
                    {user.isAdmin ? "Remove Admin" : "Make Admin"}
                  </button>
                  <button
                  onClick={() => deleteUser(user._id)}
                    className={styles.adminToggleButton}
                  >
                    Delete User
                  </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <h2 className={styles.noUsers}>No users Found</h2>
          )}
          
          <div className={styles.searchContainer}>
            <input 
              type="text" 
              placeholder="Search for a user..." 
              value={searchInput} 
              onChange={(e) => setSearchInput(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
