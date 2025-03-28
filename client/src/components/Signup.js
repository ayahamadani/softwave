import React from 'react';
import { Link } from "react-router-dom";
import styles from "./Login.module.css";
import Login from './Login';

export default function Signup() {
  return (
    <div className={styles.loginContainer}> 
      <h1>Softwave</h1>
      <div className={styles.loginInputsContainer}>
        <p className={styles.login}>SignUp</p>
        <form action="post">
          <input type="text" name="username" id="username" placeholder='username'/>
          <input type="email" name="email" id="email" placeholder='email'/>
          <input type="password" name="password" id="password" placeholder='password'/>
          <button type="submit">Submit</button>
        </form>

        <div className={styles.signUpOptionContainer}>
          <p>switch to</p>
          <Link to="/">Login?</Link>
        </div>
      </div>
    </div>
  )
}
