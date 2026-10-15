// Generates the pixel-art UI frames in public/assets/ui.
// Usage: node scripts/generate-ui-frames.cjs public/assets/ui
const fs = require('fs');
const out = process.argv[2];

const C = {
  K: '#24120a', D: '#4a2814', W: '#7a4422', H: '#a8642e', G: '#8c522a', g: '#6a3a1c',
  S: '#d4a362', P: '#efcd92', L: '#f7e0b4', E: '#6b3d1c', N: '#e0a85a',
  s: '#b8874a', p: '#e3b878', w: '#8a4b22',
};

function grid(w, h) {
  const g = Array.from({ length: h }, () => Array(w).fill(null));
  g.rect = (x, y, rw, rh, c) => { for (let j = y; j < y + rh; j++) for (let i = x; i < x + rw; i++) g[j][i] = c; };
  g.px = (x, y, c) => { g[y][x] = c; };
  return g;
}
function fromRows(rows) {
  const g = grid(rows[0].length, rows.length);
  rows.forEach((r, y) => {
    if (r.length !== rows[0].length) throw new Error('row ' + y + ' width ' + r.length);
    [...r].forEach((ch, x) => { if (ch !== '.') g[y][x] = ch; });
  });
  return g;
}
function toSvg(g) {
  const h = g.length, w = g[0].length;
  let body = '';
  for (let y = 0; y < h; y++) {
    let x = 0;
    while (x < w) {
      const c = g[y][x];
      let e = x + 1;
      while (e < w && g[y][e] === c) e++;
      if (c) body += `<rect x="${x}" y="${y}" width="${e - x}" height="1" fill="${C[c]}"/>`;
      x = e;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" shape-rendering="crispEdges">${body}</svg>\n`;
}
// Outer outline with 1px notched corners
function notched(g, x, y, w, h, c) {
  g.rect(x + 1, y, w - 2, h, c);
  g.rect(x, y + 1, w, h - 2, c);
}

// Wooden frame around parchment (inventory, item panel, dialogs). 18x18, slice 7.
{
  const g = grid(18, 18);
  notched(g, 0, 0, 18, 18, 'K');
  g.rect(1, 1, 16, 16, 'D');
  g.rect(1, 1, 15, 15, 'H');
  g.rect(2, 2, 14, 14, 'W');
  g.rect(2, 3, 14, 1, 'G'); g.rect(3, 2, 1, 14, 'G');
  g.rect(2, 14, 14, 1, 'g'); g.rect(14, 2, 1, 14, 'g');
  g.rect(5, 5, 8, 8, 'K');
  g.rect(6, 6, 6, 6, 'S');
  g.rect(7, 7, 5, 5, 'P');
  for (const [x, y] of [[3, 3], [14, 3], [3, 14], [14, 14]]) g.px(x, y, 'N');
  fs.writeFileSync(out + '/frame-wood.svg', toSvg(g));
}

// Wooden plank: same frame with a wood interior (logo plate, drawer headers). 18x18, slice 7.
{
  const g = grid(18, 18);
  notched(g, 0, 0, 18, 18, 'K');
  g.rect(1, 1, 16, 16, 'D');
  g.rect(1, 1, 15, 15, 'H');
  g.rect(2, 2, 14, 14, 'W');
  g.rect(2, 3, 14, 1, 'G'); g.rect(3, 2, 1, 14, 'G');
  g.rect(2, 14, 14, 1, 'g'); g.rect(14, 2, 1, 14, 'g');
  g.rect(5, 5, 8, 8, 'K');
  g.rect(6, 6, 6, 6, 'D');
  g.rect(7, 7, 5, 5, 'w');
  for (const [x, y] of [[3, 3], [14, 3], [3, 14], [14, 14]]) g.px(x, y, 'N');
  fs.writeFileSync(out + '/frame-plank.svg', toSvg(g));
}

// Recessed item slot. 14x14, slice 6.
{
  const g = grid(14, 14);
  notched(g, 0, 0, 14, 14, 'K');
  g.rect(1, 1, 12, 12, 'D');
  g.rect(1, 1, 11, 11, 'H');
  g.rect(2, 2, 10, 10, 'W');
  g.rect(4, 4, 6, 6, 'K');
  g.rect(5, 5, 4, 4, 's');
  g.rect(6, 6, 3, 3, 'p');
  fs.writeFileSync(out + '/frame-slot.svg', toSvg(g));
}

// Scroll paper with torn left/right edges. 12 tall tile, slice 0 5 0 5, repeat: round.
{
  const offs = [1, 1, 1, 0, 0, 0, 1, 1, 2, 2, 1, 1];
  const g = grid(12, 12);
  offs.forEach((o, y) => {
    for (let x = 0; x < 12; x++) {
      const d = Math.min(x - o, 11 - x - o); // distance from the nearer edge
      if (d < 0) continue;
      g[y][x] = d === 0 ? 'E' : d < 2 ? 'S' : 'P';
    }
  });
  fs.writeFileSync(out + '/frame-paper.svg', toSvg(g));
}

// Scroll rod (rolled paper with wooden knobs). 3-slice: 7 | 1 | 7.
{
  const left = [
    '.KKKK..',
    'KHHHWKK',
    'KHWWWKL',
    'KHWGWKP',
    'KHWGWKP',
    'KHWGWKP',
    'KWWWDKS',
    'KWDDDKs',
    'KDDDDKK',
    '.KKKK..',
  ];
  const mid = ['.', 'K', 'L', 'P', 'P', 'P', 'S', 's', 'K', '.'];
  const rows = left.map((r, y) => {
    const m = mid[y].repeat(4);
    return r + m + [...r].reverse().join('');
  });
  const fixed = rows;
  fs.writeFileSync(out + '/scroll-rod.svg', toSvg(fromRows(fixed)));
}


// Paper texture specks, tiled behind parchment
{
  const g = grid(16, 16);
  [[2, 3], [9, 1], [13, 6], [5, 10], [11, 13], [1, 14], [7, 6]].forEach(([x, y]) => g.px(x, y, 'S'));
  [[14, 10], [4, 5]].forEach(([x, y]) => g.px(x, y, 'L'));
  fs.writeFileSync(out + '/paper-texture.svg', toSvg(g).replace('<svg ', '<svg opacity="0.55" '));
}
// Mouse cursors: grids drawn at 2x so each art pixel is 2 screen pixels
function cursorSvg(rows, palette) {
  const g = fromRows(rows);
  const h = g.length, w = g[0].length;
  let body = '';
  g.forEach((row, y) => row.forEach((c, x) => {
    if (c) body += `<rect x="${x}" y="${y}" width="1" height="1" fill="${palette[c]}"/>`;
  }));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w * 2}" height="${h * 2}" shape-rendering="crispEdges">${body}</svg>
`;
}
const cursorPalette = { K: '#24120a', W: '#fff1d2', S: '#e0b878' };
fs.writeFileSync(out + '/cursor.svg', cursorSvg([
  'K...........',
  'KK..........',
  'KWK.........',
  'KWWK........',
  'KWWWK.......',
  'KWWWWK......',
  'KWWWWWK.....',
  'KWWWWWWK....',
  'KWWWWWWWK...',
  'KWWWWWWWSK..',
  'KWWWWWWSSSK.',
  'KWWWWWWKKKKK',
  'KWWWKWWK....',
  'KWWKKSWK....',
  'KWK..KSWK...',
  'KK...KSWK...',
  'K.....KSWK..',
  '......KSSK..',
  '.......KK...',
], cursorPalette));
fs.writeFileSync(out + '/cursor-click.svg', cursorSvg([
  '.....KK.......',
  '....KWWK......',
  '....KWWK......',
  '....KWWK......',
  '....KWWKKK....',
  '....KWWKWWKKK.',
  '.KK.KWWKWWKWWK',
  'KWWKKWWWWWWWWK',
  'KWWWKWWWWWWWSK',
  '.KWWWWWWWWWWSK',
  '..KWWWWWWWWWSK',
  '..KWWWWWWWWSK.',
  '...KWWWWWWSSK.',
  '....KWWWWWSK..',
  '....KKKKKKKK..',
], cursorPalette));

// Favicon: a little teal tee
// Usage adds the favicon path: node scripts/generate-ui-frames.cjs public/assets/ui src/app/icon.svg
fs.writeFileSync(process.argv[3] || out + '/../../../src/app/icon.svg', cursorSvg([
  '................',
  '....KKK..KKK....',
  '..KKTTTKKTTTKK..',
  '.KTTTTTTTTTTTTK.',
  'KTTTTTTTTTTTTTTK',
  'KTTTTTTTTTTTTTTK',
  '.KKTTTTTTTTTTKK.',
  '...KTTTTTTTTK...',
  '...KTTGGGGTTK...',
  '...KTTGTTGTTK...',
  '...KTTGGGGTTK...',
  '...KTTTTTTTTK...',
  '...KDTTTTTTDK...',
  '...KDDDDDDDDK...',
  '...KKKKKKKKKK...',
  '................',
], { K: '#24120a', T: '#2e6a74', D: '#1f4a52', G: '#f4c26f' }));
console.log('ok');
