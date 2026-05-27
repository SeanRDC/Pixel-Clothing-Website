"use client";
import React, { useState } from 'react';
import './Guide.css';

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
    answer: "Yes! Our couriers deliver across realms. Shipping fees will be calculated at checkout."
  },
  {
    id: 4,
    question: "Are the graphics durable?",
    answer: "Absolutely. We use high-quality halftone printing so your pixel art won't wash away in the rain."
  }
];

export default function Guide({ onClose }) {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('guide-overlay')) {
      onClose();
    }
  };

  return (
    <div className="guide-overlay" onClick={handleOverlayClick}>
      
      <div className={`guide-speech-box ${activeQuestion !== null ? 'visible' : ''}`}>
        <div className="guide-speech-text">
          {activeQuestion !== null ? faqData[activeQuestion].answer : ''}
        </div>
      </div>

      <div className="guide-faq-box">
        <img className="faq-bg" src="/assets/images/question.png" alt="Guide Menu" />
        
        <div className="guide-faq-questions">
          {faqData.map((faq, index) => (
            <div 
              key={faq.id}
              className={`guide-faq-question ${activeQuestion === index ? 'active' : ''}`}
              onClick={() => setActiveQuestion(index)}
            >
              {faq.question}
            </div>
          ))}
        </div>

        <button className="close-guide-btn" onClick={onClose}>
          &lt;-- Close Guide
        </button>
      </div>

    </div>
  );
}