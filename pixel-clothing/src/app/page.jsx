"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './StartPage.css';

export default function Home() {
  const router = useRouter();
  const [isStarted, setIsStarted] = useState(false);
  const [activePopup, setActivePopup] = useState(null);

  const handleStart = () => {
    setIsStarted(true);
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

    </div>
  );
}