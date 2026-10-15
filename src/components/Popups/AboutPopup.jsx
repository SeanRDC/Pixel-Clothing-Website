"use client";
import React from 'react';
import ScrollPopup from './ScrollPopup';
import styles from './Popups.module.css';

export default function AboutPopup({ onClose }) {
  return (
    <ScrollPopup title="About Us" onClose={onClose}>
      <div className={styles.about}>
        <p>Welcome to Retro Mc, where fashion is forged in pixels and printed with purpose.</p>
        <p>We&apos;re a clothing brand born from the love of retro gaming, medieval fantasy, and the timeless charm of vintage streetwear.</p>
        <p>Our signature pieces, halftone graphic tees, are crafted to look like they were pulled straight from a pixelated quest log.</p>
      </div>
    </ScrollPopup>
  );
}
