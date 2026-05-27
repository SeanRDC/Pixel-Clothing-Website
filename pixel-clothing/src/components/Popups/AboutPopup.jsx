"use client";
import React from 'react';
import './AboutPopup.css';

export default function AboutPopup({ onClose }) {
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('about-popup')) {
      onClose();
    }
  };

  return (
    <div className="about-popup" onClick={handleOverlayClick}>
      <div className="about-us">
        <img className="about-bg" src="/assets/images/comm.png" alt="Background" />
        <img className="about-title-img" src="/assets/images/aboutus.png" alt="About Us" />
        
        <p className="welcome-text">
          Welcome to Retro Mc, where fashion is forged in pixels and printed with purpose.<br /><br />
          We're a clothing brand born from the love of retro gaming, medieval fantasy, and the timeless charm of vintage streetwear.<br />
          Our signature pieces—halftone graphic tees—are crafted to look like they were pulled straight from a pixelated quest log.<br /><br />
          🕹️ Pixel-Perfect Nostalgia — Our graphics are inspired by classic RPG sprites, medieval maps, and dungeon-crawling aesthetics. Every tee tells a story.
        </p>
        
        <img className="close-x" src="/assets/images/error.png" alt="Close" onClick={onClose} />

        <button className="return-button-about" onClick={onClose}>
          &lt;-- Return
        </button>
      </div>
    </div>
  );
}