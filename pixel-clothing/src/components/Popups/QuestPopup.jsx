"use client";
import React, { useState } from 'react';
import './QuestPopup.css';

export default function QuestPopup({ onClose }) {
  const [quests, setQuests] = useState({
    tiktok: false,
    ig: false,
    discord: false,
    linkedin: false
  });

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('quest-popup')) {
      onClose();
    }
  };

  const handleQuest = (platform, url) => {
    window.open(url, '_blank');
    setQuests(prev => ({ ...prev, [platform]: true }));
  };

  return (
    <div className="quest-popup" onClick={handleOverlayClick}>
      <div className="scroll-paper">
        <div className="quest-content">
          <div className="quest-list">
            <div className="quest-item">
              <span className="quest-checkbox">{quests.tiktok ? '[X]' : '[ ]'}</span>
              <span className="quest-text">Follow on TikTok</span>
              <button className="social-icon-btn" onClick={() => handleQuest('tiktok', 'https://tiktok.com')}>
                <img src="/assets/images/tiktok.png" alt="TikTok" />
              </button>
            </div>

            <div className="quest-item">
              <span className="quest-checkbox">{quests.ig ? '[X]' : '[ ]'}</span>
              <span className="quest-text">Follow on IG</span>
              <button className="social-icon-btn" onClick={() => handleQuest('ig', 'https://instagram.com')}>
                <img src="/assets/images/instagram.png" alt="Instagram" />
              </button>
            </div>

            <div className="quest-item">
              <span className="quest-checkbox">{quests.discord ? '[X]' : '[ ]'}</span>
              <span className="quest-text">Join Discord</span>
              <button className="social-icon-btn" onClick={() => handleQuest('discord', 'https://discord.com')}>
                <img src="/assets/images/discord.png" alt="Discord" />
              </button>
            </div>

            <div className="quest-item">
              <span className="quest-checkbox">{quests.linkedin ? '[X]' : '[ ]'}</span>
              <span className="quest-text">Connect on LinkedIn</span>
              <button className="social-icon-btn" onClick={() => handleQuest('linkedin', 'https://linkedin.com')}>
                <img src="/assets/images/linkedin-logo.png" alt="LinkedIn" />
              </button>
            </div>
          </div>

          <button className="quest-return-btn" onClick={onClose}>
            &lt;-- Return
          </button>
        </div>
      </div>
    </div>
  );
}