import { React, useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import SongContext from '../../components/context/SongContext';


export default function Login() {
  const navigate = useNavigate();
  const {setUser} = useContext(SongContext);
  

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const [ formData, setFormData ] = useState({
    username: '',
    password: ''
  });

    const [warnings, setWarnings] = useState({
      username: "",
      password: ""
    });

  const [ error, setError ] = useState(null);

  const blur = () => {
    setWarnings({
        username: "",
        password: ""
      });
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("https://softwave-music-player.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if(!response.ok) {
        if (data.message === "user not found") {
          setWarnings((prev) => ({ ...prev, username: "user not found" }));
        }

        if (data.message === "wrong password") {
          setWarnings((prev) => ({ ...prev, password: "wrong password" }));
          return;
        } 

        setError(data.message || "Signup failed!");
        return;
      }
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      navigate("/adminPanel");
    } catch (error) {
      setError(error.message);
    }
  }


  return (
    <div className={styles.loginContainer}> 
      <h1 className={styles.title}>Softwave</h1>
      <div className={styles.loginInputsContainer}>
        <p className={styles.login}>Login</p>
        <form action="post" onSubmit={handleSubmit} >
          <input type="text" name="username" id="username" placeholder='username' required onChange={handleChange} value={formData.username} onBlur={blur}/>
          <p style={{ display: warnings.username ? "block" : "none"}} className={styles.warningMessage}>{warnings.username}</p>
          <input type="password" name="password" id="password" placeholder='password' required onChange={handleChange} value={formData.password} onBlur={blur}/>
          <p style={{ display: warnings.password ? "block" : "none"}} className={styles.warningMessage}>{warnings.password}</p>
          <button type="submit">Submit</button>
        </form>

        <div className={styles.signUpOptionContainer}>
          <p>don't have an account?</p>
          <Link to="/signup">Sign up!</Link>
        </div>
      </div>
    </div>
  )
}
