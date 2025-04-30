import { useState } from "react";
import styles from "./Home.module.css";
import Lottie from "react-lottie";
import travelAnimation from "../assets/travel.json";

export default function Home() {
  const [inputs, setInputs] = useState({
    origin_city: "",
    month: "July",
    year: 2025,
    holiday_type: "Cultural",
    max_price: 500,
    climate: "hot",
  });
  const [results, setResults] = useState([]);
  const handleChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8000/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputs),
    });
    if (!res.ok) {
      alert("Search error: " + (await res.text()));
      return;
    }
    setResults(await res.json());
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: travelAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className={styles.home}>      
      <div className={styles.heroSection}>
        <div className={styles.lottieContainer}>
          <Lottie options={defaultOptions} height={300} width={300} />
        </div>
        <h2 className={styles.heroTitle}>Find Your Perfect Private Flight</h2>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Form inputs unchanged */}
      </form>
      {/* Search results table unchanged */}
    </div>
  );
}