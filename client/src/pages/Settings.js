import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Settings.module.css";

export default function Settings() {
  const { currentUser, changeEmail, changePassword } = useAuth();
  const [email, setEmail] = useState(currentUser?.email || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleEmailChange(e) {
    e.preventDefault();
    try {
      await changeEmail(email);
      setMessage("Email updated!");
    } catch {
      setMessage("Failed to update email");
    }
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    try {
      await changePassword(password);
      setMessage("Password updated!");
    } catch {
      setMessage("Failed to update password");
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Settings</h2>
      {message && <p className={styles.message}>{message}</p>}

      <form onSubmit={handleEmailChange} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>New Email</label>
          <input
            className={styles.formInput}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <button className={styles.button} type="submit">
          Update Email
        </button>
      </form>

      <form onSubmit={handlePasswordChange} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>New Password</label>
          <input
            className={styles.formInput}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button className={styles.button} type="submit">
          Update Password
        </button>
      </form>
    </div>
  );
}
