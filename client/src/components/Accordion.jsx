import React, { useState } from "react";
import styles from "./Accordion.module.css";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function Accordion({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.accordion}>
      <button
        className={styles.header}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
      </button>
      {isOpen && <div className={styles.content}>{children}</div>}
    </div>
  );
}