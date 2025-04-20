import { React, useEffect, useState, useContext } from 'react';
import styles from "./AdminPanel.module.css";
import Navbar from '../../components/Navbar/Navbar';
import SongContext from '../../components/context/SongContext';

export default function AdminPanel() {
    const [image, setImage] = useState(null);
    const [songFile, setSongFile] = useState(null);
    const { 
      currentSongData,
      setCurrentSongData,
      playSong,
      currentSongAudio,
      setCurrentSongAudio,
      rewindSong,
      songs,
      setSongs,
      getSongIndex,
      skipSong,
      toggleLike,
      searchQuery,
      setSearchQuery,
      loading,
      setLoading
   } = useContext(SongContext);

    const handleSongFile = (event) => {
      const file = event.target.files[0];
      if (file) {
        setSongFile(file);
        console.log("Selected song file:", file);
      }
    };

    const handleImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        setImage(URL.createObjectURL(file)); // Create a preview URL
      }
      console.log(file);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("audio", songFile);
    
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
    
      const data = await res.json();
      console.log(data);
    };
    
  
  return (
    <div>
        <div>
           <form  onSubmit={handleSubmit} className={styles.addSongForm}>
            <p>Add a Song</p>
              <input type="text" placeholder='song name'/>
              <input type="text" placeholder='artist'/>
              <select name="" id="">
                  <option value="" disabled>genre</option>
                  <option value="">genre1</option>
                  <option value="">genre2</option>
                  <option value="">genre3</option>
                  <option value="">genre4</option>
              </select>
              <div id={styles.labelContainer}>
              <label htmlFor="fileInput" style={{ cursor: "pointer", fontSize: "13px", color: "gray" }}>Add an album cover</label>
              </div>
              <input 
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }} // Hide the default file input
              />
              {/* TODO */}
              <input
               type="file"
               accept="audio/mp3"
               placeholder='song file'
               onChange={handleSongFile}
               
               />
               <button type="submit">Submit</button>
           </form>
        </div>
        <div></div>
    </div>
  )
}
