import { React, useEffect, useState, useContext } from 'react';
import styles from "./AdminPanel.module.css";
import Navbar from '../../components/Navbar/Navbar';
import SongContext from '../../components/context/SongContext';
import axios from 'axios';

export default function AdminPanel() {
    const [image, setImage] = useState(null);
    const [songFile, setSongFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const [songName, setSongName] = useState("");
    const [artist, setArtist] = useState("");
    const [genre, setGenre] = useState("");

  //   const { 
  //     currentSongData,
  //     setCurrentSongData,
  //     playSong,
  //     currentSongAudio,
  //     setCurrentSongAudio,
  //     rewindSong,
  //     songs,
  //     setSongs,
  //     getSongIndex,
  //     skipSong,
  //     toggleLike,
  //     searchQuery,
  //     setSearchQuery,
  //     loading,
  //     setLoading
  //  } = useContext(SongContext);

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
      const formData = new FormData();
      formData.append("audio", songFile);
      formData.append("image", imageFile);

      console.log("About to upload:");
      console.log("songFile:", songFile);
      console.log("imageFile:", imageFile);
    
      try {
        const res = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });
    
        const data = await res.json();
        console.log("Uploaded URLs:", data);
    
        // Then post metadata to MongoDB
        await axios.post("http://localhost:5000/songs", {
          name: songName,
          artist,
          genre,
          audioUrl: data.audioUrl,
          albumCover: data.imageUrl
        });
    
        alert("Song added!");

        // Reset form
        setSongName("");
        setArtist("");
        setGenre("");
        setSongFile(null);
        setImageFile(null);
        setImage(null);
      } catch (err) {
        console.error("Upload error:", err);
      }
    };
    
    
  
  return (
    <div style={{display: "flex", justifyContent: "space-between"}}>
        <div style={{width: "50%"}}>
           <form  onSubmit={handleSubmit} className={styles.addSongForm}>
            <p>Add a Song</p>
              <input type="text" placeholder='song name' value={songName} onChange={(e) => setSongName(e.target.value)}/>
              <input type="text" placeholder='artist' value={artist} onChange={(e) => setArtist(e.target.value)}/>
              <select name="" id="" value={genre} onChange={(e) => {setGenre(e.target.value); console.log(e.target.value);}}>
                  <option value="" disabled>genre</option>
                  <option value="genre1">genre1</option>
                  <option value="genre2">genre2</option>
                  <option value="genre3">genre3</option>
                  <option value="genre4">genre4</option>
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
               accept="audio/*"
               placeholder='song file'
               onChange={handleSongFile}
               
               />
               <button type="submit">Submit</button>
           </form>
        </div>
      <div style={{width: "50%"}}>
        <p>Make user an admin...</p>
        <hr style={{width: "30em"}}/>
      </div>
    </div>
  )
}
