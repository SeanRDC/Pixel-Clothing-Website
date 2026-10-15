import styles from './Logo.module.css';

// Hand-drawn bitmap letters for the wordmark (2px stems, 8 rows tall)
const GLYPHS = {
  R: ['#####.', '######', '##..##', '######', '#####.', '##.##.', '##..##', '##..##'],
  E: ['######', '######', '##....', '#####.', '#####.', '##....', '######', '######'],
  T: ['######', '######', '..##..', '..##..', '..##..', '..##..', '..##..', '..##..'],
  O: ['.####.', '######', '##..##', '##..##', '##..##', '##..##', '######', '.####.'],
  M: ['##...##', '###.###', '#######', '##.#.##', '##...##', '##...##', '##...##', '##...##'],
  C: ['.#####', '######', '##....', '##....', '##....', '##....', '######', '.#####'],
};

const LINES = ['RETRO', 'MC'];
const GLYPH_H = 8;
const LINE_GAP = 3;
const PAD = 1; // room for the outline

const COLORS = {
  light: '#fff1d2',
  shade: '#f2c98a',
  outline: '#24120a',
  depth: '#c26a2a',
};

function buildWordmark() {
  const lineWidth = (text) => [...text].reduce((w, ch, i) => w + GLYPHS[ch][0].length + (i ? 1 : 0), 0);
  const width = Math.max(...LINES.map(lineWidth)) + PAD * 2;
  const height = LINES.length * GLYPH_H + (LINES.length - 1) * LINE_GAP + PAD * 2 + 2;
  const grid = Array.from({ length: height }, () => Array(width).fill(null));

  LINES.forEach((text, li) => {
    const top = PAD + li * (GLYPH_H + LINE_GAP);
    let x = PAD + Math.floor((width - PAD * 2 - lineWidth(text)) / 2);
    for (const ch of text) {
      GLYPHS[ch].forEach((row, gy) => {
        [...row].forEach((cell, gx) => {
          if (cell === '#') grid[top + gy][x + gx] = gy < 5 ? 'light' : 'shade';
        });
      });
      x += GLYPHS[ch][0].length + 1;
    }
  });

  // 1px outline around the letters, then a 2px drop for depth
  const filled = (x, y) => grid[y]?.[x] === 'light' || grid[y]?.[x] === 'shade';
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x]) continue;
      const near = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, 1], [1, -1], [-1, -1]].some(([dx, dy]) => filled(x + dx, y + dy));
      if (near) grid[y][x] = 'outline';
    }
  }
  for (let y = height - 1; y > 0; y--) {
    for (let x = 0; x < width; x++) {
      if (!grid[y][x] && grid[y - 1][x] === 'outline') grid[y][x] = y >= 2 && grid[y - 2][x] && grid[y - 2][x] !== 'outline' ? 'depth' : null;
    }
  }

  const rects = [];
  grid.forEach((row, y) => {
    let x = 0;
    while (x < width) {
      const c = row[x];
      let end = x + 1;
      while (end < width && row[end] === c) end++;
      if (c) rects.push({ x, y, w: end - x, fill: COLORS[c] });
      x = end;
    }
  });
  return { width, height, rects };
}

const WORDMARK = buildWordmark();

export default function Logo({ size = 'large', className = '' }) {
  return (
    <div className={`${styles.plate} ${styles[size]} ${className}`} role="img" aria-label="Retro MC">
      <svg
        className={styles.wordmark}
        viewBox={`0 0 ${WORDMARK.width} ${WORDMARK.height}`}
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        {WORDMARK.rects.map((r) => (
          <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />
        ))}
      </svg>
    </div>
  );
}
