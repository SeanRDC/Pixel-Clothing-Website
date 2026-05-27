"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AudioController from '../components/AudioController/AudioController';
import QuestPopup from '../components/Popups/QuestPopup';
import AboutPopup from '../components/Popups/AboutPopup';
import './StartPage.css';

export default function Home() {
  const router = useRouter();
  const [isStarted, setIsStarted] = useState(false);
  const [activePopup, setActivePopup] = useState(null);
  const [isHidingButton, setIsHidingButton] = useState(false);

  const handleStart = () => {
    setIsHidingButton(true);
    setTimeout(() => {
      setIsStarted(true);
    }, 400); 
  };

  const navigateToHouse = () => {
    router.push('/house');
  };

  return (
    <div className="start-page-container">
      <div className={`blur-overlay ${isStarted ? 'remove-blur' : ''}`}></div>

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
            <p onClick={() => setActivePopup('quest')}>Quest</p>
            <p onClick={navigateToHouse}>Enter House</p>
            <p onClick={() => router.push('/house#guide')}>Guide</p>
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
    </div>
  );
}