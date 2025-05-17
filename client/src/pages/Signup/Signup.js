import { useEffect, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import styles from "../Login/Login.module.css";
import { useState } from 'react';
import SongContext from '../../components/context/SongContext';

export default function Signup() {
   const navigate = useNavigate();
   const {setUser} = useContext(SongContext);
  
    useEffect(() => {
      const user = localStorage.getItem("user");
      if (user) {
        navigate("/", { replace: true });
      }
    }, []);

  const [ formData, setFormData ] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [warnings, setWarnings] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [ error, setError ] = useState(null);
  
  const blur = () => {
    setWarnings({
        username: "",
        email: "",
        password: ""
      });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "username") {
      setWarnings((prev) => ({
        ...prev,
        username: value.length < 6 ? "username should be at least 6 characters" : ""
      }));
    }

    if (name === "email") {
      setWarnings((prev) => ({
        ...prev,
        email: /\S+@\S+\.\S+/.test(value) ? "" : "invalid email"
      }));
    }

    if (name === "password") {
      setWarnings((prev) => ({
        ...prev,
        password: value.length < 6 ? "password should be at least 6 characters" : ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("https://softwave-music-player.onrender.com/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "username is taken") {
          setWarnings((prev) => ({ ...prev, username: "Username is already taken" }));
        }

        if (data.message === "email is taken") {
          setWarnings((prev) => ({ ...prev, email: "Email is already in use" }));
          return;
        } 

        setError(data.message || "Signup failed!");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      window.location.reload();
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className={styles.loginContainer}> 
      <h1 className={styles.title}>Softwave</h1>
      <div className={styles.loginInputsContainer}>
        <p className={styles.login}>SignUp</p>
        <form action="post" onSubmit={handleSubmit}>
          <input type="text" name="username" id="username" placeholder='username' onChange={handleChange} required onBlur={blur} onClick={handleChange}/>
          <p style={{ display: warnings.username ? "block" : "none"}} className={styles.warningMessage}>{warnings.username}</p>
          <input type="email" name="email" id="email" placeholder='email' onChange={handleChange} required onBlur={blur} onClick={handleChange}/>
          <p style={{ display: warnings.email ? "block" : "none"}} className={styles.warningMessage}>{warnings.email}</p>
          <input type="password" name="password" id="password" placeholder='password' onChange={handleChange} required onBlur={blur} onClick={handleChange}/>
          <p style={{ display: warnings.password ? "block" : "none"}} className={styles.warningMessage}>{warnings.password}</p>
          <button type="submit">Submit</button>
        </form>

        <div className={styles.signUpOptionContainer}>
          <p>switch to</p>
          <Link to="/login">Login?</Link>
        </div>
      </div>
    </div>
  )
}
