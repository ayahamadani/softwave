import {React, useState } from 'react'
import Navbar from '../components/Navbar/Navbar';
import BottomPlayer from '../components/BottomPlayer/BottomPlayer';

export default function Playlists() {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div>
      <Navbar setSearchQuery={setSearchQuery}/>
      <BottomPlayer />
    </div>
  )
}
