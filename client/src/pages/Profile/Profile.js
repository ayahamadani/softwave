import { React, useEffect, useState, useContext } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import SongContext from '../../components/context/SongContext';

export default function Profile() {
    const { userIcon, setUserIcon } = useContext(SongContext);
    const user = JSON.parse(localStorage.getItem("user"));
    const [searchQuery, setSearchQuery] = useState("");

  return (
      <div>
        <div style={{ marginLeft: "3em", gap: "1em", display: "flex", flexDirection: "column" }}>
            <p>Profile...</p>
            <hr style={{ width: "50%"}}/>
            <p><strong>Icon:</strong></p>
            <img src={userIcon} alt="user-icon" style={{borderRadius: "25px", width: "15em"}}/>
            <button style={{width: "17em", borderRadius: "15px", border: "solid 2px purple", color: "purple", backgroundColor: "white", height: "2em"}}>Edit Icon</button>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>User Type:</strong> { user.isAdmin ? "Admin " : "Normal"}</p>
        </div>
    </div>
  )
}
