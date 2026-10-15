"use client";
import { useEffect, useRef } from 'react';

// Draw results are cached per draw function, so revisiting a page is instant.
const cache = new WeakMap();

export function paint(canvas, pc) {
  canvas.width = pc.width;
  canvas.height = pc.height;
  canvas.getContext('2d').putImageData(new ImageData(pc.data, pc.width, pc.height), 0, 0);
}

export default function PixelArt({ draw, width, height, className, style }) {
  const ref = useRef(null);

  useEffect(() => {
    let pc = cache.get(draw);
    if (!pc) {
      pc = draw();
      cache.set(draw, pc);
    }
    paint(ref.current, pc);
  }, [draw]);

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      className={className}
      style={{ imageRendering: 'pixelated', ...style }}
      aria-hidden="true"
    />
  );
}
