import { React, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

export default function Login() {
  const [ formData, setFormData ] = useState({
    username: '',
    password: ''
  });

    const [warnings, setWarnings] = useState({
      username: "",
      password: ""
    });

  const [ error, setError ] = useState(null);
  const navigate = useNavigate();

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
      const response = await fetch("http://localhost:5000/auth/login", {
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

      navigate("/home");
    } catch (error) {
      setError(error.message);
    }
  }


  return (
    <div className={styles.loginContainer}> 
      <h1>Softwave</h1>
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
