"use client";
import React from 'react';
import './QuestPopup.css';

export default function QuestPopup({ onClose }) {
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('quest-popup')) {
      onClose();
    }
  };

  return (
    <div className="quest-popup" onClick={handleOverlayClick}>
      <div className="quest-content">
        <img className="quest-image" alt="Quest Background" src="/assets/images/Quest.png" />

        <button className="social-button btn-tiktok" onClick={() => window.open('https://tiktok.com', '_blank')}>
          <img alt="TikTok" src="/assets/images/tiktok.png" width="100%" />
        </button>

        <button className="social-button btn-ig" onClick={() => window.open('https://instagram.com', '_blank')}>
          <img alt="Instagram" src="/assets/images/instagram.png" width="100%" />
        </button>

        <button className="social-button btn-discord" onClick={() => window.open('https://discord.com', '_blank')}>
          <img alt="Discord" src="/assets/images/discord.png" width="100%" />
        </button>

        <button className="return-button" onClick={onClose}>
          <span>&lt;--</span> Return
        </button>
      </div>
    </div>
  );
}