"use client";
import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import PixelIcon from '../ui/PixelIcon';
import styles from './ScrollPopup.module.css';

const CLOSE_MS = 380;

export default function ScrollPopup({ title, onClose, children, returnLabel = 'Return' }) {
  const [isClosing, setIsClosing] = useState(false);
  const dialogRef = useRef(null);
  const titleId = useId();

  const closeTimer = useRef(null);
  // Parents pass a new onClose every render; keep the latest without re-running effects
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  const close = useCallback(() => {
    if (closeTimer.current) return;
    setIsClosing(true);
    closeTimer.current = setTimeout(() => onCloseRef.current(), CLOSE_MS);
  }, []);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    dialogRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      previouslyFocused?.focus?.();
    };
  }, [close]);

  return (
    <div
      className={`${styles.overlay} ${isClosing ? styles.closing : ''}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        className={styles.scroll}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className={styles.rod} />
        <div className={styles.paperWrap}>
          <div className={`${styles.paper} paper-texture`}>
            <h2 id={titleId} className={styles.title}>{title}</h2>
            <div className={styles.divider} />
            <div className={styles.body}>{children}</div>
            <button type="button" className={`btn ${styles.returnBtn}`} onClick={close}>
              <PixelIcon name="back" size={20} />
              {returnLabel}
            </button>
          </div>
        </div>
        <div className={styles.rod} />
      </div>
    </div>
  );
}
