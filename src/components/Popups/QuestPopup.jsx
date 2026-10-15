"use client";
import React, { useState } from 'react';
import ScrollPopup from './ScrollPopup';
import PixelIcon from '../ui/PixelIcon';
import styles from './Popups.module.css';

const QUESTS = [
  { key: 'tiktok', label: 'Follow on TikTok', url: 'https://tiktok.com', icon: '/assets/images/tiktok.png' },
  { key: 'ig', label: 'Follow on IG', url: 'https://instagram.com', icon: '/assets/images/instagram.png' },
  { key: 'discord', label: 'Join Discord', url: 'https://discord.com', icon: '/assets/images/discord.png' },
  { key: 'linkedin', label: 'Connect on LinkedIn', url: 'https://linkedin.com', icon: '/assets/images/linkedin-logo.png' },
];

const defaultQuests = { tiktok: false, ig: false, discord: false, linkedin: false };

// The popup only mounts after a click, so it's safe to read storage on first render.
function loadQuests() {
  try {
    return { ...defaultQuests, ...JSON.parse(localStorage.getItem('dailyQuests')) };
  } catch {
    return defaultQuests;
  }
}

export default function QuestPopup({ onClose }) {
  const [quests, setQuests] = useState(loadQuests);
  const doneCount = QUESTS.filter((q) => quests[q.key]).length;

  const completeQuest = (key) => {
    const updatedQuests = { ...quests, [key]: true };
    setQuests(updatedQuests);
    try {
      localStorage.setItem('dailyQuests', JSON.stringify(updatedQuests));
    } catch {
      // progress just won't persist
    }
  };

  return (
    <ScrollPopup title="Quest" onClose={onClose}>
      <p className={styles.progress}>
        Daily quests <strong>{doneCount}/{QUESTS.length}</strong>
      </p>
      <ul className={styles.list}>
        {QUESTS.map((quest) => (
          <li key={quest.key}>
            <a
              className={`${styles.card} ${quests[quest.key] ? styles.done : ''}`}
              href={quest.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => completeQuest(quest.key)}
            >
              <span className={styles.checkbox} aria-hidden="true">
                {quests[quest.key] && <PixelIcon name="check" size={24} />}
              </span>
              <span className={styles.questText}>
                {quest.label}
                {quests[quest.key] && <span className="visually-hidden"> (completed)</span>}
              </span>
              <img className={styles.social} src={quest.icon} alt="" />
            </a>
          </li>
        ))}
      </ul>
    </ScrollPopup>
  );
}
