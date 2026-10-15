"use client";
import React, { useState, useRef, useEffect } from 'react';
import useHydrated from '../../lib/useHydrated';
import './AudioController.css';

export default function AudioController({ isVisible }) {
  const isHydrated = useHydrated();
  // null until the user toggles; until then fall back to the saved preference
  const [mutedChoice, setMutedChoice] = useState(null);
  const isMuted = mutedChoice ?? (isHydrated && localStorage.getItem('musicMuted') === 'true');
  const audioRef = useRef(null);

  useEffect(() => {
    if (isVisible && isHydrated && audioRef.current && !isMuted) {
      audioRef.current.play().catch(() => {});
    }
  }, [isVisible, isHydrated, isMuted]);

  const toggleSound = () => {
    const newMuteState = !isMuted;
    setMutedChoice(newMuteState);

    localStorage.setItem('musicMuted', newMuteState);

    if (newMuteState) {
      audioRef.current.pause();
    }
  };

  return (
    <div className={`sound-toggle-container ${isVisible ? 'visible' : ''}`}>
      <audio ref={audioRef} src="/assets/audio/song.m4a" loop preload="none" />
      <img
        src={isMuted ? "/assets/images/soundoff.png" : "/assets/images/sound.png"}
        alt={isMuted ? "Mute Icon" : "Sound Icon"}
        className="sound-icon"
        onClick={toggleSound}
      />
    </div>
  );
}
