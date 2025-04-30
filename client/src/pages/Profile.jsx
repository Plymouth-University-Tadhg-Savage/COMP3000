import React, { useState, useEffect } from "react";
import styles from "./Profile.module.css";
import { useAuth } from "../contexts/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Profile() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    dob: "",
    passportCountry: ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    const fetchProfile = async () => {
      const docRef = doc(db, "profiles", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
    };
    fetchProfile();
  }, [currentUser]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setSaving(true);
    const docRef = doc(db, "profiles", currentUser.uid);
    try {
      await setDoc(docRef, profile, { merge: true });
      alert("Profile saved successfully.");
    } catch (err) {
      console.error(err);
      alert("Error saving profile: " + err.message);
    }
    setSaving(false);
  };

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.heading}>Your Profile</h2>
      <form onSubmit={handleSubmit} className={styles.profileForm}>
        <label className={styles.label} htmlFor="name">Full Name</label>
        <input
          className={styles.input}
          id="name"
          name="name"
          type="text"
          value={profile.name}
          onChange={handleChange}
          required
        />

        <label className={styles.label} htmlFor="dob">Date of Birth</label>
        <input
          className={styles.input}
          id="dob"
          name="dob"
          type="date"
          value={profile.dob}
          onChange={handleChange}
          required
        />

        <label className={styles.label} htmlFor="passportCountry">Passport Country of Origin</label>
        <input
          className={styles.input}
          id="passportCountry"
          name="passportCountry"
          type="text"
          value={profile.passportCountry}
          onChange={handleChange}
          required
        />

        <button className={styles.button} type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}