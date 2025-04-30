import React from "react";
import Accordion from "../components/Accordion";
import styles from "./Faq.module.css";

const FAQ_DATA = [
  { question: "How does JetSetGo work?", answer: "Instead of picking a destination first, you tell us your ideal budget, weather, and holiday style — and we find the perfect places for you!" },
  { question: "Can I book flights directly through JetSetGo?", answer: "Currently, JetSetGo helps you discover your best travel matches. Direct booking features will be coming soon!" },
  { question: "What kind of holiday styles can I choose from?", answer: "City Breaks, Beach Holidays, Cultural Adventures, Luxury Getaways, Party Trips, Religious Tours, and more!" },

  { question: "Can I set a maximum budget for my trip?", answer: "Yes! Simply tell us your ideal maximum price, and we’ll only show flights that fit your budget." },
  { question: "Does JetSetGo consider the weather when recommending places?", answer: "Absolutely! You can pick your preferred climate — hot, mild, or cold — and we’ll find destinations with the right vibe." },
  { question: "Will JetSetGo check visa requirements for me?", answer: "Yes! After you select a flight, JetSetGo checks visa and travel requirements based on your passport country, saving you time and stress." },
  { question: "Do I need to create an account to use JetSetGo?", answer: "You’ll need a simple login to personalize your experience, store your profile (like passport country), and view saved journeys." },
  { question: "Is JetSetGo available worldwide?", answer: "JetSetGo is designed to support users globally — just select your origin city and let the magic happen!" },
  { question: "What happens if I don’t have a visa for a recommended destination?", answer: "No worries! Our system will alert you about any visa needs, so you can prepare properly before booking." },
  { question: "Can I use JetSetGo to plan group holidays?", answer: "JetSetGo is built for individual travelers right now, but group travel features are planned for future updates!" },
];

export default function Faq() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Frequently Asked Questions</h1>
      <div className={styles.list}>
        {FAQ_DATA.map((item, idx) => (
          <Accordion key={idx} title={item.question}>
            <p>{item.answer}</p>
          </Accordion>
        ))}
      </div>
    </div>
  );
}