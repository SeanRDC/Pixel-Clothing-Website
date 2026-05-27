"use client";
import React, { useState, useRef, useEffect } from 'react';
import './AudioController.css';

export default function AudioController({ isVisible }) {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isVisible && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [isVisible]);

  const toggleSound = () => {
    if (isMuted) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
    setIsMuted(!isMuted);
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