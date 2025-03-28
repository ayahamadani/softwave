import './App.css';
import { useEffect } from 'react';
import Login from './components/Login';
import Signup from "./components/Signup";
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
    </Routes>
  </Router>
  );
} 

export default App;
