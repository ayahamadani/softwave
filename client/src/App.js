import './App.css';
import { useEffect } from 'react';
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import Signup from "./components/Signup/Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
// useEffect(() => {
//   fetch("http://localhost:5000/").then(res => res.json()).then(json => console.log(json));
// }, []);

  return (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  </Router>
  );
} 

export default App;
