"use client";
import React, { useState, useEffect } from 'react';
import './AboutPopup.css';
import './QuestPopup.css';

export default function QuestPopup({ onClose }) {
  const [quests, setQuests] = useState({ tiktok: false, ig: false, discord: false, linkedin: false });
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const savedQuests = localStorage.getItem('dailyQuests');
    if (savedQuests) setQuests(JSON.parse(savedQuests));
  }, []);

  const triggerClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 700); 
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('popup-overlay')) triggerClose();
  };

  const handleQuest = (platform, url) => {
    window.open(url, '_blank');
    const updatedQuests = { ...quests, [platform]: true };
    setQuests(updatedQuests);
    localStorage.setItem('dailyQuests', JSON.stringify(updatedQuests));
  };

  return (
    <div className={`popup-overlay ${isClosing ? 'closing' : ''}`} onClick={handleOverlayClick}>
      <div className="popup-paper quest-layout">
        <div className="popup-content quest-content-spacing">
          <div className="quest-list">
            <div className="quest-item" onClick={() => handleQuest('tiktok', 'https://tiktok.com')}>
              <span className={`quest-checkbox ${quests.tiktok ? 'completed' : ''}`}>
                {quests.tiktok ? '[X]' : '[ ]'}
              </span>
              <span className="quest-text">Follow on TikTok</span>
              <div className="social-icon-btn">
                <img src="/assets/images/tiktok.png" alt="TikTok" />
              </div>
            </div>

            <div className="quest-item" onClick={() => handleQuest('ig', 'https://instagram.com')}>
              <span className={`quest-checkbox ${quests.ig ? 'completed' : ''}`}>
                {quests.ig ? '[X]' : '[ ]'}
              </span>
              <span className="quest-text">Follow on IG</span>
              <div className="social-icon-btn">
                <img src="/assets/images/instagram.png" alt="Instagram" />
              </div>
            </div>

            <div className="quest-item" onClick={() => handleQuest('discord', 'https://discord.com')}>
              <span className={`quest-checkbox ${quests.discord ? 'completed' : ''}`}>
                {quests.discord ? '[X]' : '[ ]'}
              </span>
              <span className="quest-text">Join Discord</span>
              <div className="social-icon-btn">
                <img src="/assets/images/discord.png" alt="Discord" />
              </div>
            </div>

            <div className="quest-item" onClick={() => handleQuest('linkedin', 'https://linkedin.com')}>
              <span className={`quest-checkbox ${quests.linkedin ? 'completed' : ''}`}>
                {quests.linkedin ? '[X]' : '[ ]'}
              </span>
              <span className="quest-text">Connect on LinkedIn</span>
              <div className="social-icon-btn">
                <img src="/assets/images/linkedin-logo.png" alt="LinkedIn" />
              </div>
            </div>
          </div>

          <button className="popup-return-btn" onClick={triggerClose}>
            &lt;-- Return
          </button>
        </div>
      </div>
    </div>
  );
}