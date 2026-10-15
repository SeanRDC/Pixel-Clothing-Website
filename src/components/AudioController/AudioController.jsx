"use client";
import React, { useState, useRef, useEffect } from 'react';
import useHydrated from '../../lib/useHydrated';
import IconButton from '../ui/IconButton';
import styles from './AudioController.module.css';

export default function AudioController({ isVisible, className = '' }) {
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

    try {
      localStorage.setItem('musicMuted', newMuteState);
    } catch {
      // preference just won't persist
    }

    if (newMuteState) {
      audioRef.current.pause();
    }
  };

  return (
    <div className={`${styles.toggle} ${isVisible ? styles.visible : ''} ${className}`}>
      <audio ref={audioRef} src="/assets/audio/song.m4a" loop preload="none" />
      <IconButton
        icon={isMuted ? 'soundOff' : 'sound'}
        label={isMuted ? 'Unmute music' : 'Mute music'}
        aria-pressed={isMuted}
        onClick={toggleSound}
        tabIndex={isVisible ? 0 : -1}
      />
    </div>
  );
}
