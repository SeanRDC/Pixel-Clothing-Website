// 16x16 pixel-art icons. Shapes are drawn as fills only; a dark 1px outline
// is added automatically so every icon shares the same chunky look.

const SIZE = 16;

export const PALETTE = {
  K: '#24120a', // outline
  B: '#6b3a1a', // dark wood
  b: '#9a5a2a', // wood
  c: '#d79a52', // light wood
  Y: '#f4c26f', // gold
  O: '#c97a14', // deep gold
  R: '#b8321f', // red
  r: '#e8665a', // light red
  G: '#4f8f38', // green
  g: '#9be070', // light green
  W: '#fff4dc', // highlight
};

function fromRows(rows) {
  return rows.map((row) => {
    if (row.length !== SIZE) throw new Error(`Icon row must be ${SIZE} wide: "${row}"`);
    return [...row].map((ch) => (ch === '.' ? null : ch));
  });
}

function fromFn(fn) {
  return Array.from({ length: SIZE }, (_, y) =>
    Array.from({ length: SIZE }, (_, x) => fn(x + 0.5, y + 0.5) || null)
  );
}

function withOutline(grid) {
  return grid.map((row, y) =>
    row.map((c, x) => {
      if (c) return c;
      const near = [[0, 1], [0, -1], [1, 0], [-1, 0]].some(([dx, dy]) => grid[y + dy]?.[x + dx]);
      return near ? 'K' : null;
    })
  );
}

// One <rect> per horizontal run of the same colour
function toRects(grid) {
  const rects = [];
  grid.forEach((row, y) => {
    let x = 0;
    while (x < SIZE) {
      const c = row[x];
      let end = x + 1;
      while (end < SIZE && row[end] === c) end++;
      if (c) rects.push({ x, y, w: end - x, fill: PALETTE[c] });
      x = end;
    }
  });
  return rects;
}

const polar = (x, y) => {
  const dx = x - 8, dy = y - 8;
  return { r: Math.hypot(dx, dy), a: Math.atan2(dy, dx) };
};

const speakerBody = [
  '................',
  '................',
  '......b.........',
  '.....bb.........',
  '....bcb.........',
  '.bbbccb.........',
  '.bccccb.........',
  '.bccccb.........',
  '.bccccb.........',
  '.bbbccb.........',
  '....bcb.........',
  '.....bb.........',
  '......b.........',
  '................',
  '................',
  '................',
];

function overlay(base, extra) {
  return base.map((row, y) => [...row].map((ch, x) => (extra[y][x] !== '.' ? extra[y][x] : ch)).join(''));
}

const chevronDown = fromRows([
  '................',
  '................',
  '................',
  '................',
  '................',
  '...cc......cc...',
  '...ccc....ccc...',
  '....ccc..ccc....',
  '.....cccccc.....',
  '......cccc......',
  '.......cc.......',
  '................',
  '................',
  '................',
  '................',
  '................',
]);

const defs = {
  cart: fromRows([
    '................',
    '.bb.............',
    '..b.............',
    '..bccccccccccc..',
    '..bcBcBcBcBcBc..',
    '...cBcBcBcBcBc..',
    '...ccccccccccc..',
    '....cBcBcBcBc...',
    '....ccccccccc...',
    '.....b..........',
    '.....bbbbbbbbb..',
    '................',
    '.....BB....BB...',
    '.....BB....BB...',
    '................',
    '................',
  ]),

  sound: fromFn((x, y) => {
    const body = speakerBody[Math.floor(y)][Math.floor(x)];
    if (body !== '.') return body;
    // two sound waves fanning out from the speaker cone
    const r = Math.hypot(x - 6.5, y - 8);
    const facing = x > 8 && Math.abs(Math.atan2(y - 8, x - 6.5)) < 0.95;
    if (facing && ((r > 3.1 && r < 4.3) || (r > 5.9 && r < 7.1))) return 'Y';
    return null;
  }),

  soundOff: fromRows(overlay(speakerBody, [
    '................',
    '................',
    '................',
    '................',
    '................',
    '.........R...R..',
    '..........R.R...',
    '...........R....',
    '..........R.R...',
    '.........R...R..',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
  ])),

  gear: fromFn((x, y) => {
    const { r, a } = polar(x, y);
    if (r < 1.9) return null;
    if (r < 3.4) return 'c';
    if (r < 4.9) return 'b';
    const sector = ((a + Math.PI) / (Math.PI / 4)) % 1;
    if (r < 6.5 && (sector < 0.2 || sector > 0.8)) return 'b';
    return null;
  }),

  backpack: fromRows([
    '................',
    '......BBBB......',
    '.....B....B.....',
    '....bbbbbbbb....',
    '...bccccccccb...',
    '...bBBBBBBBBb...',
    '...bBBBYYBBBb...',
    '...bbbbbbbbbb...',
    '..bbccccccccbb..',
    '..bbcbbbbbbcbb..',
    '..bbcbBBBBbcbb..',
    '..bbcbbbbbbcbb..',
    '...bccccccccb...',
    '....bbbbbbbb....',
    '................',
    '................',
  ]),

  back: fromFn((x, y) => {
    // arrow head
    if (x >= 2 && x <= 8 && Math.abs(y - 8) <= x - 1.5) return x < 4 ? 'b' : 'c';
    // shaft
    if (x > 8 && x < 14 && y > 5.5 && y < 10.5) return y < 7 ? 'c' : y > 9 ? 'b' : 'c';
    return null;
  }),

  close: fromFn((x, y) => {
    const onDiag = Math.abs(x - y) < 1.6 || Math.abs(x - (16 - y)) < 1.6;
    if (x > 2 && x < 14 && y > 2 && y < 14 && onDiag) return (x + y) % 4 < 2 ? 'r' : 'R';
    return null;
  }),

  check: fromFn((x, y) => {
    const shortArm = x >= 2.5 && x <= 6.5 && Math.abs(y - (x + 5)) < 1.3;
    const longArm = x >= 6 && x <= 13.5 && Math.abs(y - (17.5 - x)) < 1.3;
    return shortArm || longArm ? (y < 9 ? 'g' : 'G') : null;
  }),

  coin: fromFn((x, y) => {
    const { r } = polar(x, y);
    if (r > 6.4) return null;
    if (r > 5.2) return y < 8 ? 'Y' : 'O';
    if (Math.abs(x - 8) < 1.1 && Math.abs(y - 8) < 3.2) return 'O';
    return x + y < 13 ? 'W' : 'Y';
  }),

  chevronDown: chevronDown,
  chevronUp: [...chevronDown].reverse(),
  chevronRight: chevronDown.map((_, y) => chevronDown.map((row) => row[y])),
  chevronLeft: chevronDown.map((_, y) => [...chevronDown].reverse().map((row) => row[y])),
};

export const ICONS = Object.fromEntries(
  Object.entries(defs).map(([name, grid]) => [name, toRects(withOutline(grid))])
);
