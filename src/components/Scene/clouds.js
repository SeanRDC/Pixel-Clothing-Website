// Procedural pixel clouds. Each layer is a strip that wraps around horizontally,
// so two copies side by side can scroll forever without a seam.

export const STRIP_W = 352;
export const STRIP_H = 80;

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function buildGrid({ seed, count, width: [minW, maxW], height: [minH, maxH], top: [minY, maxY] }) {
  const rand = rng(seed);
  const grid = Array.from({ length: STRIP_H }, () => new Uint8Array(STRIP_W));

  for (let n = 0; n < count; n++) {
    const cw = minW + rand() * (maxW - minW);
    const ch = minH + rand() * (maxH - minH);
    const cx = (n + rand() * 0.6) * (STRIP_W / count);
    const base = minY + rand() * (maxY - minY);
    const puffs = 3 + Math.floor(rand() * 3);

    for (let p = 0; p < puffs; p++) {
      const t = puffs === 1 ? 0.5 : p / (puffs - 1);
      const px = cx - cw / 2 + t * cw;
      const rx = cw / (puffs * 0.9) * (0.7 + rand() * 0.5);
      const ry = ch * (0.55 + rand() * 0.45) * (1 - Math.abs(t - 0.5));
      for (let y = Math.floor(base - ry); y <= base; y++) {
        if (y < 0 || y >= STRIP_H) continue;
        const dy = (y + 0.5 - base) / Math.max(ry, 1);
        const half = rx * Math.sqrt(Math.max(0, 1 - dy * dy));
        for (let x = Math.floor(px - half); x <= px + half; x++) {
          grid[y][((x % STRIP_W) + STRIP_W) % STRIP_W] = 1;
        }
      }
    }
  }
  return grid;
}

// Light along the top edge, shade along the bottom edge, mid colour inside.
export function buildCloudRects(layer) {
  const grid = buildGrid(layer);
  const tone = (x, y) => {
    if (!grid[y][x]) return null;
    if (y < 2 || !grid[y - 1][x] || !grid[y - 2][x]) return 'light';
    if (y > STRIP_H - 3 || !grid[y + 1][x] || !grid[y + 2]?.[x]) return 'dark';
    return 'mid';
  };

  const rects = [];
  for (let y = 0; y < STRIP_H; y++) {
    let x = 0;
    while (x < STRIP_W) {
      const t = tone(x, y);
      let end = x + 1;
      while (end < STRIP_W && tone(end, y) === t) end++;
      if (t) rects.push({ x, y, w: end - x, tone: t });
      x = end;
    }
  }
  return rects;
}
