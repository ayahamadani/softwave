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
    const [users, setUsers] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);


    const { 
      userIcon
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
    
    useEffect(() => {
      const fetchUsers = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;
    
        try {
          const res = await axios.get("http://localhost:5000/auth");
          const fetchedUsers = res.data;
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
        await axios.put(`http://localhost:5000/auth/${userId}/makeAdmin`);
        const res = await axios.get("http://localhost:5000/auth");
        setUsers(res.data);
        } catch (err) {
          console.error("Error toggling Adminship", err);
      }
    }

  
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
        <div>
          <p>Make user an admin...</p>
          <hr style={{width: "30em", marginBottom: "2em"}}/>
        </div>
        <div>
          {users.length > 0 ? (
            <>
              <div style={{ display: "flex", flexDirection: "row", gap: "1em", width: "100%" }}>
                {filteredUsers.map((user, index) => (
                <div
                  style={{
                    height: "15em",
                    width: "15em",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    marginTop: "1em",
                    cursor: "pointer",
                    textDecoration: "none",
                    color: "inherit"
                  }}
                >
                  <img src={userIcon} alt="user-icon" style={{ width: "80%", borderRadius: "15px", height: "80%", objectFit: "cover", alignSelf: "center" }} />
                  <h3 style={{textAlign: "center"}}>{user.username}</h3>
                  <p style={{ color: "gray", textAlign: "center", marginTop: "0.5em" }}>{user.isAdmin ? "Admin" : "Normal"} User</p>
                  <input onClick={() => toggleAdmin(user._id)} style={{borderRadius: "7px", padding: "0.5em 1em", marginTop: "0.5em", border: "solid 2px purple", color: "purple", background: "none", cursor: "pointer" }} type="button" value={user.isAdmin? "Remove Admin" : "Make Admin"}/>
                </div>
                ))}
              </div>
            </>
          ) : (
            <h2 style={{ marginTop: "2em" }}>No users Found</h2>
          )}
        </div>
        <div style={{paddingTop: "3em"}}>
          <input style={{borderRadius: "7px", padding: "0.5em 1em", marginTop: "0.5em", border: "solid 2px purple", background: "none" }} type="text" placeholder="search for a user" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}/>
        </div>
      </div>
    </div>
  )
}
