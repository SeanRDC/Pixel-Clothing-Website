"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AudioController from '../components/AudioController/AudioController';
import QuestPopup from '../components/Popups/QuestPopup';
import AboutPopup from '../components/Popups/AboutPopup';
import Guide from '../components/Guide/Guide';
import './StartPage.css';

const backgrounds = [
  'bg.png',
  'bgimg2.png',
  'bgimg3.png',
  'bgimg4.png',
  'bgimg5.png',
  'bgimg6.png',
  'bgimg7.png'
];

export default function Home() {
  const router = useRouter();
  const [isStarted, setIsStarted] = useState(false);
  const [activePopup, setActivePopup] = useState(null);
  const [isHidingButton, setIsHidingButton] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    backgrounds.forEach((bg) => {
      const img = new Image();
      img.src = `/assets/images/${bg}`;
    });
  }, []);

  useEffect(() => {
    if (isNavigating) return;
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isNavigating]);

  const handleStart = () => {
    setIsHidingButton(true);
    setTimeout(() => {
      setIsStarted(true);
    }, 400); 
  };

  const navigateToHouse = () => {
    setIsNavigating(true);
    router.push('/house');
  };

  return (
    <div className="start-page-container">
      {backgrounds.map((bg, index) => (
        <div
          key={bg}
          className={`bg-layer ${index === bgIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url('/assets/images/${bg}')` }}
        />
      ))}

      <div className={`blur-overlay ${isStarted && !activePopup ? 'remove-blur' : ''}`}></div>

      <div className="logo-container">
        <img src="/assets/images/logo.png" alt="Retro Mc Logo" className="logo" />
      </div>

      <main className="main-content">
        {!isStarted ? (
          <img 
            src="/assets/images/start.png" 
            alt="Touch to Start" 
            className="start-button"
            onClick={handleStart} 
            style={{ opacity: isHidingButton ? 0 : '', transition: 'opacity 0.4s ease' }}
          />
        ) : (
          <div className={`menu-text ${isStarted ? 'show' : ''}`}>
            <p onClick={navigateToHouse}>Enter House</p>
            <p onClick={() => setActivePopup('quest')}>Quest</p>
            <p onClick={() => setActivePopup('guide')}>Guide</p>
            <p onClick={() => setActivePopup('about')}>About Us</p>
          </div>
        )}
      </main>

      <AudioController isVisible={isStarted} />

      {activePopup === 'quest' && (
        <QuestPopup onClose={() => setActivePopup(null)} />
      )}
      
      {activePopup === 'about' && (
        <AboutPopup onClose={() => setActivePopup(null)} />
      )}

      {activePopup === 'guide' && (
        <Guide onClose={() => setActivePopup(null)} />
      )}
    </div>
  );
}