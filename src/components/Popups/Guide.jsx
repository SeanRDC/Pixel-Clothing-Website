"use client";
import React, { useState } from 'react';
import ScrollPopup from './ScrollPopup';
import styles from './Popups.module.css';

const faqData = [
  {
    id: 1,
    question: "How do I purchase items?",
    answer: "Click on any item slot in the shop. Choose your size, and click 'Add to Cart' to stash it in your inventory."
  },
  {
    id: 2,
    question: "What is your return policy?",
    answer: "We accept returns within 30 days for unworn and unwashed gear. Contact the guildmaster (support) for help!"
  },
  {
    id: 3,
    question: "Do you ship globally?",
    answer: "Yes! Our couriers deliver across realms. Shipping fees will be calculated at checkout worldwide, swiftly, reliably."
  },
  {
    id: 4,
    question: "Are the graphics durable?",
    answer: "Absolutely. We use high-quality halftone printing so your pixel art won't wash away in the rain."
  }
];

const greeting = "You seem like you need help. What is it that you need to ask?";

export default function Guide({ onClose }) {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const answer = activeQuestion !== null ? faqData[activeQuestion].answer : greeting;

  return (
    <ScrollPopup title="Guide" onClose={onClose}>
      <div className={styles.speech} aria-live="polite">
        <span className={styles.speaker}>EJ</span>
        <p key={answer} className={styles.speechText}>{answer}</p>
      </div>

      <ul className={styles.list}>
        {faqData.map((faq, index) => (
          <li key={faq.id}>
            <button
              type="button"
              className={`${styles.card} ${activeQuestion === index ? styles.active : ''}`}
              aria-pressed={activeQuestion === index}
              onClick={() => setActiveQuestion(index)}
            >
              <span className={styles.marker} aria-hidden="true">{activeQuestion === index ? '▶' : '>'}</span>
              <span className={styles.question}>{faq.question}</span>
            </button>
          </li>
        ))}
      </ul>
    </ScrollPopup>
  );
}
