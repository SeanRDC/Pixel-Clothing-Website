"use client";
import { useEffect, useRef } from 'react';
import { drawEJ, EJ_W, EJ_H } from './ej';
import { paint } from '../ui/PixelArt';

const TICK_MS = 100;
const frameCache = new Map();

function frame(opts) {
  const key = JSON.stringify(opts);
  let f = frameCache.get(key);
  if (!f) {
    f = drawEJ(opts);
    frameCache.set(key, f);
  }
  return f;
}

/**
 * Animated EJ, split into two canvases so the counter can sit between them.
 * pose: 'idle' | 'wave' | 'present'; talking moves her mouth; happy = big grin.
 */
export default function EJ({ pose, talking, happy, bodyClassName, handsClassName, bodyStyle, handsStyle }) {
  const bodyRef = useRef(null);
  const handsRef = useRef(null);
  const props = useRef({ pose, talking, happy });

  useEffect(() => {
    props.current = { pose, talking, happy };
  }, [pose, talking, happy]);

  useEffect(() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let tick = 0;
    let nextBlink = 30;
    let lastKey = '';

    const render = () => {
      const { pose: p, talking: t, happy: h } = props.current;
      const blink = !h && tick >= nextBlink && tick < nextBlink + 2;
      if (tick >= nextBlink + 2) nextBlink = tick + 25 + Math.floor(Math.random() * 30);
      const opts = {
        pose: p,
        waveFrame: still ? 0 : Math.floor(tick / 3) % 2,
        breath: still ? 0 : Math.floor(tick / 12) % 2,
        face: {
          blink,
          happy: h,
          mouthShape: h ? 'grin' : t && tick % 4 < 2 ? 'open' : 'smile',
        },
      };
      const key = JSON.stringify(opts);
      if (key !== lastKey) {
        const { body, hands } = frame(opts);
        paint(bodyRef.current, body);
        paint(handsRef.current, hands);
        lastKey = key;
      }
      tick++;
    };

    render();
    const id = setInterval(() => {
      if (!document.hidden) render();
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <canvas ref={bodyRef} width={EJ_W} height={EJ_H} className={bodyClassName} style={{ imageRendering: 'pixelated', ...bodyStyle }} aria-hidden="true" />
      <canvas ref={handsRef} width={EJ_W} height={EJ_H} className={handsClassName} style={{ imageRendering: 'pixelated', ...handsStyle }} aria-hidden="true" />
    </>
  );
}
