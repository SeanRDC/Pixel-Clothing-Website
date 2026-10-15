"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useHydrated from '../lib/useHydrated';
import Scene from '../components/Scene/Scene';
import Logo from '../components/ui/Logo';
import AudioController from '../components/AudioController/AudioController';
import QuestPopup from '../components/Popups/QuestPopup';
import AboutPopup from '../components/Popups/AboutPopup';
import Guide from '../components/Popups/Guide';
import styles from './page.module.css';

const MENU = [
  { key: 'house', label: 'Enter House' },
  { key: 'quest', label: 'Quest' },
  { key: 'guide', label: 'Guide' },
  { key: 'about', label: 'About Us' },
];

export default function Home() {
  const router = useRouter();
  const [hasClickedStart, setHasClickedStart] = useState(false);
  const [activePopup, setActivePopup] = useState(null);
  const [isLeaving, setIsLeaving] = useState(false);

  // Hidden until hydrated so the "Start" prompt doesn't flash when returning
  const isInitialized = useHydrated();

  // Returning from the house skips the start prompt
  const isReturning = isInitialized && sessionStorage.getItem('hasStarted') === 'true';
  const isStarted = hasClickedStart || isReturning;

  const handleStart = () => {
    sessionStorage.setItem('hasStarted', 'true');
    setHasClickedStart(true);
  };

  const handleMenu = (key) => {
    if (key !== 'house') {
      setActivePopup(key);
      return;
    }
    setIsLeaving(true);
    router.prefetch('/house');
    setTimeout(() => router.push('/house'), 450);
  };

  const closePopup = () => setActivePopup(null);

  return (
    <div className={`${styles.page} ${isLeaving ? styles.leaving : ''}`}>
      <Scene />
      <div className={`${styles.veil} ${isStarted && !activePopup ? styles.veilLifted : ''}`} />

      <main className={styles.main} style={{ visibility: isInitialized ? 'visible' : 'hidden' }}>
        <h1 className={styles.logoWrap}>
          <Logo />
        </h1>

        {!isStarted ? (
          <button type="button" className={styles.start} onClick={handleStart}>
            Press to Start
          </button>
        ) : (
          <nav className={styles.menu} aria-label="Main menu">
            {MENU.map((item, i) => (
              <button
                key={item.key}
                type="button"
                className={styles.menuItem}
                style={{ animationDelay: `${i * 70}ms` }}
                onClick={() => handleMenu(item.key)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </main>

      <AudioController isVisible={isStarted} className={styles.sound} />

      <a
        href="https://www.linkedin.com/in/sean-rhani-dela-cruz-834573334"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.credit}
        style={{ visibility: isInitialized ? 'visible' : 'hidden' }}
      >
        <span className={styles.creditDefault}>Developed by Sean Rhani Dela Cruz</span>
        <span className={styles.creditHover} aria-hidden="true">Visit LinkedIn</span>
      </a>

      {activePopup === 'quest' && <QuestPopup onClose={closePopup} />}
      {activePopup === 'about' && <AboutPopup onClose={closePopup} />}
      {activePopup === 'guide' && <Guide onClose={closePopup} />}
    </div>
  );
}
