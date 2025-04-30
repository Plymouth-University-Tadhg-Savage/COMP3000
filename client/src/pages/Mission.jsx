import React from "react";
import styles from "./Mission.module.css";
import heroImg from "../assets/plane_world.jpg";

export default function Mission() {
  return (
    <section className={styles.mission}>
      <img
        src={heroImg}
        alt="Private jet in flight"
        className={styles.heroImage}
      />
      <div className={styles.textContainer}>
        <h2>Who We Are</h2>
        <p>
        At JetSetGo, we believe travel should be about adventure, not endless searching!
        Instead of picking a destination first, just tell us what you’re dreaming of — the vibe you want, your budget, the kind of weather you love — and we’ll match you with the best places around the world. 🌞🏖️🌆

        Whether you're chasing the sun, looking for a cultural escape, or planning the ultimate party holiday, JetSetGo makes it easy. Plus, we even factor in your passport and visa requirements, so you’ll only see destinations that are ready and waiting for you. 🌍✨

        Get ready to discover where the world can take you — the easy, exciting way!
        </p>
      </div>
    </section>
  );
}
