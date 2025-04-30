import React, { useState, useEffect } from "react";
import styles from "./FlightSearch.module.css";
import { useAuth } from "../contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const months = Array.from({ length: 12 }, (_, i) =>
  new Date(0, i).toLocaleString("default", { month: "long" })
);
const holidayTypes = [
  "City Break", "Cultural", "Luxury", "Religious", "Adventure", "Beach", "Party"
];
const climates = ["hot", "mild", "cold"];

export default function FlightSearch() {
  const { currentUser } = useAuth();
  const [form, setForm] = useState({
    origin_city: "",
    month: "",
    year: new Date().getFullYear(),
    holiday_type: "",
    max_price: "",
    climate: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [apiError, setApiError] = useState("");
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [visaText, setVisaText] = useState("");
  const [passportCountry, setPassportCountry] = useState("");

  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, "profiles", currentUser.uid)).then(snap => {
      if (snap.exists()) setPassportCountry(snap.data().passportCountry);
    });
  }, [currentUser]);

  useEffect(() => {
    if (!selectedFlight || !passportCountry) return;
    (async () => {
      try {
        const res = await fetch("http://localhost:8000/visa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            origin_city: selectedFlight.origin_city,
            destination_city: selectedFlight.destination_city,
            passport_country: passportCountry
          })
        });
        const data = await res.json();
        setVisaText(data.visa_requirements || "No info returned.");
      } catch {
        setVisaText("Error fetching visa info.");
      }
    })();
  }, [selectedFlight, passportCountry]);

  const validate = () => {
    const errs = {};
    if (!form.origin_city) errs.origin_city = "Required";
    if (!form.month) errs.month = "Required";
    if (!form.year || form.year < 2023) errs.year = "Enter 2023+";
    if (!form.holiday_type) errs.holiday_type = "Required";
    if (!form.max_price || parseFloat(form.max_price) <= 0)
      errs.max_price = "Must be > 0";
    if (!form.climate) errs.climate = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    setResults([]);
    setSelectedFlight(null);
    setVisaText("");
    try {
      const res = await fetch("http://localhost:8000/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          year: parseInt(form.year, 10),
          max_price: parseFloat(form.max_price)
        })
      });
      if (!res.ok) throw new Error(await res.text());
      setResults(await res.json());
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.searchContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Origin City</label>
          <input
            name="origin_city"
            className={styles.formInput}
            value={form.origin_city}
            onChange={handleChange}
          />
          {errors.origin_city && <div className={styles.formError}>{errors.origin_city}</div>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Month</label>
          <select
            name="month"
            className={styles.formSelect}
            value={form.month}
            onChange={handleChange}
          >
            <option value="">Select month</option>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          {errors.month && <div className={styles.formError}>{errors.month}</div>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Year</label>
          <input
            name="year"
            type="number"
            min="2023"
            className={styles.formInput}
            value={form.year}
            onChange={handleChange}
          />
          {errors.year && <div className={styles.formError}>{errors.year}</div>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Holiday Type</label>
          <select
            name="holiday_type"
            className={styles.formSelect}
            value={form.holiday_type}
            onChange={handleChange}
          >
            <option value="">Select type</option>
            {holidayTypes.map(ht => <option key={ht} value={ht}>{ht}</option>)}
          </select>
          {errors.holiday_type && <div className={styles.formError}>{errors.holiday_type}</div>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Max Price (GBP)</label>
          <input
            name="max_price"
            type="number"
            step="0.01"
            className={styles.formInput}
            value={form.max_price}
            onChange={handleChange}
          />
          {errors.max_price && <div className={styles.formError}>{errors.max_price}</div>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Climate</label>
          <select
            name="climate"
            className={styles.formSelect}
            value={form.climate}
            onChange={handleChange}
          >
            <option value="">Select climate</option>
            {climates.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.climate && <div className={styles.formError}>{errors.climate}</div>}
        </div>

        <div className={styles.formGroupFullWidth}>
          <button
            type="submit"
            className={styles.button}
            disabled={loading}
          >
            {loading ? "Searching…" : "Search Flights"}
          </button>
        </div>
      </form>

      {apiError && <div className={styles.apiError}>{apiError}</div>}

      {results.length > 0 && (
        <table className={styles.resultsTable}>
          <thead>
            <tr>
              <th>Airline</th><th>Origin</th><th>Destination</th>
              <th>Price</th><th>Departure</th><th>Select</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr
                key={i}
                className={selectedFlight === r ? styles.selectedRow : ""}
              >
                <td>{r.airline}</td>
                <td>{r.origin_city}</td>
                <td>{r.destination_city}</td>
                <td>£{r.price_gbp.toFixed(2)}</td>
                <td>{new Date(r.departure_datetime).toLocaleString()}</td>
                <td>
                  <button
                    className={styles.selectButton}
                    onClick={() => setSelectedFlight(r)}
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {visaText && (
        <div className={styles.visaSection}>
          <h3>Visa & Travel Requirements</h3>
          <pre className={styles.visaText}>{visaText}</pre>
        </div>
      )}
    </div>
  );
}
