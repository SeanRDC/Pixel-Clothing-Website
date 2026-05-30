"use client";
import React, { useState, useRef, useEffect } from 'react';
import './AudioController.css';

export default function AudioController({ isVisible }) {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const savedMuteState = localStorage.getItem('musicMuted') === 'true';
    setIsMuted(savedMuteState);

    if (isVisible && audioRef.current && !savedMuteState) {
      audioRef.current.play().catch(() => {}); 
    }
  }, [isVisible]);

  const toggleSound = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    
    localStorage.setItem('musicMuted', newMuteState);

    if (newMuteState) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
  };

  return (
    <div className={`sound-toggle-container ${isVisible ? 'visible' : ''}`}>
      <audio ref={audioRef} src="/assets/audio/song.m4a" loop />
      <img
        src={isMuted ? "/assets/images/soundoff.png" : "/assets/images/sound.png"}
        alt={isMuted ? "Mute Icon" : "Sound Icon"}
        className="sound-icon"
        onClick={toggleSound}
      />
    </div>
  );
}