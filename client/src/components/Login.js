import React from 'react';
import { Link } from "react-router-dom";
import styles from "./Login.module.css";

export default function Login() {
  return (
    <div className={styles.loginContainer}> 
      <h1>Softwave</h1>
      <div className={styles.loginInputsContainer}>
        <p className={styles.login}>Login</p>
        <form action="post">
          <input type="text" name="username" id="username" placeholder='username'/>
          <input type="password" name="password" id="password" placeholder='password'/>
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
