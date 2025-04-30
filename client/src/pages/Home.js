import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import FlightSearch from "../components/FlightSearch";
import styles from "./Home.module.css";

export default function Home() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch {
      console.error("Failed to log out");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Welcome, {currentUser.displayName || currentUser.email}
        </h2>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Log Out
        </button>
      </div>
      <FlightSearch />
    </div>
  );
}