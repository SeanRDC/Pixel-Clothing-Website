"use client";
import React, { useState } from 'react';
import './AboutPopup.css';

export default function AboutPopup({ onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  const triggerClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 700); 
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('popup-overlay')) triggerClose();
  };

  return (
    <div className={`popup-overlay ${isClosing ? 'closing' : ''}`} onClick={handleOverlayClick}>
      {/* We apply the shared base classes, PLUS the specific layout classes! */}
      <div className="popup-paper about-layout">
        <div className="popup-content about-content-spacing">
          
          <div className="about-text-container">
            <p className="welcome-text">Welcome to Retro Mc, where fashion is forged in pixels and printed with purpose.</p>
            <p className="welcome-text">We're a clothing brand born from the love of retro gaming, medieval fantasy, and the timeless charm of vintage streetwear.</p>
            <p className="welcome-text">Our signature pieces halftone graphic tees are crafted to look like they were pulled straight from a pixelated quest log.</p>
          </div>

          <button className="popup-return-btn" onClick={triggerClose}>&lt;-- Return</button>
        </div>
      </div>
    </div>
  );
}