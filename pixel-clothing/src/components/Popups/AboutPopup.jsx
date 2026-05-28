"use client";
import React, { useState } from 'react';
import './AboutPopup.css';

export default function AboutPopup({ onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  const triggerClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 700); 
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('about-popup')) {
      triggerClose();
    }
  };

  return (
    <div className={`about-popup ${isClosing ? 'closing' : ''}`} onClick={handleOverlayClick}>
      <div className="about-paper">
        <div className="about-content">
          
          <div className="about-text-container">
            <p className="welcome-text">
              Welcome to Retro Mc, where fashion is forged in pixels and printed with purpose.
            </p>
            <p className="welcome-text">
              We're a clothing brand born from the love of retro gaming, medieval fantasy, and the timeless charm of vintage streetwear.
            </p>
            <p className="welcome-text">
              Our signature pieces halftone graphic tees are crafted to look like they were pulled straight from a pixelated quest log.
            </p>
          </div>

          <button className="about-return-btn" onClick={triggerClose}>
            &lt;-- Return
          </button>
        </div>
      </div>
    </div>
  );
}