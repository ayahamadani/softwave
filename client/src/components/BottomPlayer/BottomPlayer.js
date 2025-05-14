import { React, useEffect, useState, useContext, useRef } from 'react';
import SongContext from '../context/SongContext';
import AuthModalContext from "../context/AuthModalContext";
import styles from "./BottomPlayer.module.css";
import axios from 'axios';

export default function BottomPlayer() {
    const { triggerAuthModal } = useContext(AuthModalContext);
    const { currentSongData, playSong, currentSongAudio, rewindSong, skipSong, toggleLike, volume, setVolume, currentQueue, user } = useContext(SongContext);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [lastVolume, setLastVolume] = useState(1);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef();
    const [showModal, setShowModal] = useState(false);
    const [playlistName, setPlaylistName] = useState("");
    const [showPlaylistSelect, setShowPlaylistSelect] = useState(false);
    const [userPlaylists, setUserPlaylists] = useState([]);



    useEffect(() => {
        if (!currentSongAudio) return;
    
        const updateTime = () => {
          setCurrentTime(currentSongAudio.currentTime);
          setDuration(currentSongAudio.duration || 0);
        };
    
        currentSongAudio.addEventListener("timeupdate", updateTime);
        currentSongAudio.addEventListener("loadedmetadata", updateTime);
    
        return () => {
          currentSongAudio.removeEventListener("timeupdate", updateTime);
          currentSongAudio.removeEventListener("loadedmetadata", updateTime);
        };
      }, [currentSongAudio]);

      const handleSeek = (e) => {
        const seekTime = parseFloat(e.target.value);
        currentSongAudio.currentTime = seekTime;
        setCurrentTime(seekTime);
      };
    
      const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
      };

      const toggleVolume = () => {
        if (volume > 0) {
          setLastVolume(volume);
          setVolume(0);
          currentSongAudio.volume = 0;
        } else {
          setVolume(lastVolume);
          currentSongAudio.volume = lastVolume;
        }
      };
    
      const changeVolume = (e) => {
        let value = e.target.value;
        setVolume(value);
        currentSongAudio.volume = value;
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

    const handleCreatePlaylist = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !currentSongData?._id) {
          console.error("Missing user or song data");
          return;
        }
    
        const res = await axios.post("https://softwave-music-player.onrender.com/playlists", {
          name: playlistName,
          userId: user.userId,
          songId: currentSongData._id
        });
    
        console.log("Created playlist:", res.data); // helpful for debugging
    
        setShowModal(false);
        setPlaylistName("");
      } catch (err) {
        console.error("Error creating playlist", err);
      }
    };

    const fetchUserPlaylists = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      try {
        const res = await axios.get(`https://softwave-music-player.onrender.com/playlists/user/${user.userId}`);
        setUserPlaylists(res.data);
        setShowPlaylistSelect(true);
      } catch (err) {
        console.error("Error fetching playlists", err);
      }
    };    

    const addToPlaylist = async (playlistId) => {
      try {
        await axios.put(`https://softwave-music-player.onrender.com/playlists/${playlistId}/add`, {
          songId: currentSongData._id,
        });
        setShowPlaylistSelect(false);
      } catch (err) {
        console.error("Error adding song to playlist", err);
      }
    };

    const handleLike = () => {
      if (!user) {
        triggerAuthModal();
        return;
      }
      toggleLike(currentSongData);
    };
    
    

    return (
      <div className={styles.stickyBottom}>
      <div className={styles.leftControls}>
            <img src={currentSongData.albumCover} alt="currently-playing-song" style={{ width: "5em", height: "5em", objectFit: "cover" }}/>
            <div className={styles.white}>
            <strong style={{color: "white"}}>{currentSongData.name}</strong>
            <p style={{color: "white"}}>{currentSongData.artist}</p>
            </div>
        </div>
        <div className={styles.middleControls}>
            <div className={styles.audioControlIconsContainer}>
                <i style={{ cursor: "pointer" }} className="fa-solid fa-backward-step" onClick={() => rewindSong(currentSongData)}></i>
                <i style={{ cursor: "pointer" }} className={`fa-solid ${currentSongData.isPlaying ? "fa-pause" : "fa-play"}`} onClick={() => playSong(currentSongData, currentQueue)}></i>
                <i style={{ cursor: "pointer" }} className="fa-solid fa-forward-step" onClick={() => skipSong(currentSongData)}></i>
            </div>
            <div className={styles.progressContainer}>
                <span style={{color: "white"}}>{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  step="0.1"
                  onChange={handleSeek}
                  className={styles.progressBar}
                  style={{
                    '--progress': duration ? `${(currentTime / duration) * 100}%` : '0%'
                  }}
                />
                <span style={{color: "white"}}>{formatTime(duration)}</span>
            </div>
        </div>

         
        
      <div className={styles.rightControls}>
          <div style={{display: "flex"}}>
              <div style={{marginRight: "0.5em"}}>
                {volume > 0 && volume < 0.6 ? (
                  <i
                    style={{color: "white"}}
                    className="fa-solid fa-volume-low"
                    onClick={() => toggleVolume()}
                  />
                ) : volume >= 0.6 ? (
                  <i
                    style={{color: "white"}}
                    className="fa-solid fa-volume-high"
                    onClick={() => toggleVolume()}
                  />
                ) : (
                  <i
                    style={{color: "white"}}
                    className="fa-solid fa-volume-off"
                    onClick={() => toggleVolume()}
                  />
                )}
              </div>
              <div className="mr1">
                <input
                  className={styles.volumeInput}
                  type="range"
                  style={{ marginRight: "0.5em"}}
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={changeVolume}
                />
              </div>
            </div>
            {showDropdown && (
              <div className={styles.bottomDropDownMenu} ref={dropdownRef}>
                <div className={styles.dropdownItem} onClick={fetchUserPlaylists}>Add To Existing Playlist</div>                
                <div
                  className={styles.dropdownItem}
                  style={{ color: "purple" }}
                  onClick={() => {
                    if (!user) {
                      triggerAuthModal();
                      return;
                    }
                    setShowModal(true);
                    setShowDropdown(false);
                  }}
                >
                  Create A New Playlist
                </div>
              </div>
            )}
            {showModal && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                  <h3>Create a Playlist</h3>
                  <input
                    type="text"
                    placeholder="Enter playlist name"
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                    className={styles.modalInput}
                  />
                  <div className={styles.modalButtons}>
                    <button onClick={handleCreatePlaylist}>Create</button>
                    <button onClick={() => setShowModal(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
            {showPlaylistSelect && (
              <div className={styles.modal}>
                <button className={styles.closeButton} onClick={() => setShowPlaylistSelect(false)}>✖</button>
                <h4>Select a playlist</h4>
                {userPlaylists.map((playlist) => (
                  <div
                    key={playlist._id}
                    className={styles.dropdownItem}
                    onClick={() => addToPlaylist(playlist._id)}
                  >
                    {playlist.name}
                  </div>
                ))}
              </div>
            )}
           <i
              className="fa-solid fa-plus"
              style={{ color: "white", marginRight: "1em", cursor: "pointer" }}
              onClick={() => {
                if (!user) {
                  triggerAuthModal();
                  return;
                }
                setShowDropdown((prev) => !prev);
              }}
            ></i>

            <i style={{color: "white", cursor: "pointer"}} className={`fa-heart ${currentSongData.isLiked ? "fa-solid" : "fa-regular"}`} onClick={handleLike}></i>
        </div>
    </div>
    )
}
