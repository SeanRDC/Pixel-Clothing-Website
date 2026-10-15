// Inside the Clothing Merchant's shop, on a 320x180 grid.
// `drawShopBack` is everything behind EJ; `drawCounter` is the foreground.
import PixelCanvas, { seeded, valueNoise, mix } from '../../lib/pixel/PixelCanvas';
import { drawText, textWidth } from '../../lib/pixel/font';
import { EJ_H, EJ_W, EJ_COUNTER_Y } from './ej';

export const SHOP_W = 320;
export const SHOP_H = 180;
export const COUNTER_TOP = 128;

// EJ stands centred with her waist hidden by the counter
export const EJ_POS = { x: SHOP_W / 2 - EJ_W / 2, y: COUNTER_TOP - EJ_COUNTER_Y };

const pct = (x, y) => ({ x: (x / SHOP_W) * 100, y: (y / SHOP_H) * 100 });
export const SHOP_ANCHORS = {
  lantern: pct(298, 74),
  candle: pct(58, 116),
  window: pct(93, 50),
  ej: { x: (EJ_POS.x / SHOP_W) * 100, y: (EJ_POS.y / SHOP_H) * 100, w: (EJ_W / SHOP_W) * 100, h: (EJ_H / SHOP_H) * 100 },
};

const C = {
  outline: '#1a0f0a',
  plank: ['#4e2f19', '#462a16', '#55341c'],
  seam: '#2a170b',
  grain: '#3e2412',
  beam: '#2e1a0e', beamLight: '#4a2c18', beamDark: '#1e1008',
  nail: '#8a6a4a',
  night: '#1b1838', nightLight: '#2f2a58', moon: '#f4d77a', star: '#cfc6ff',
  windowFrame: '#3a2212', sill: '#6b3a1a', sillLight: '#8f5228',
  shelf: '#6b3a1a', shelfLight: '#8f5228', shelfDark: '#3a2010',
  cloth: [['#2f6a74', '#235058'], ['#4f7a3a', '#3a5a2a'], ['#d8c49a', '#b8a272'], ['#8a3a3a', '#6a2a2a'], ['#3a4a7a', '#2a3660']],
  pole: '#8a6a4a', hanger: '#c9b48a',
  sign: '#6b3a1a', signLight: '#8f5228', gold: '#f4c26f',
  lantern: '#ffb347', lanternLight: '#fff1b8', iron: '#2a2430',
  counterTop: '#9a5a2a', counterTopLight: '#c07a3a', counterEdge: '#5a3018', counterFront: '#5e331a',
  counterPanel: '#4e2a14', counterPanelLight: '#6e3d1e', counterShadow: '#2e1808',
  candle: '#f2e6c8', candleShade: '#c9b88e', flame: '#ffd36a', flameCore: '#fff6d0', holder: '#8a6a3a',
  book: '#7a2a2a', bookLight: '#a03a3a', pages: '#f2e6c8', quill: '#f4f0e6',
  coin: '#f4c26f', coinDark: '#c97a14',
};

function wall(pc) {
  const n = valueNoise(21, 6);
  for (let y = 0; y < SHOP_H; y++) {
    const board = Math.floor(y / 9);
    const seam = y % 9 === 0;
    for (let x = 0; x < SHOP_W; x++) {
      if (seam) { pc.px(x, y, C.seam); continue; }
      // stagger the vertical joints between boards
      const joint = (x + board * 37) % 64 === 0;
      if (joint) { pc.px(x, y, C.seam); continue; }
      let c = C.plank[board % 3];
      if (n(x * 0.6, y * 3) > 0.45) c = C.grain;
      pc.px(x, y, c);
    }
  }
  // nails at the joints
  for (let y = 4; y < SHOP_H; y += 9) {
    const board = Math.floor(y / 9);
    for (let x = (64 - ((board * 37) % 64)) % 64; x < SHOP_W; x += 64) {
      pc.px(x - 2, y, C.nail);
      pc.px(x + 2, y, C.nail);
    }
  }
}

function beams(pc) {
  pc.rect(0, 0, SHOP_W, 12, C.beam);
  pc.hline(0, SHOP_W, 11, C.beamDark);
  pc.hline(0, SHOP_W, 1, C.beamLight);
  for (const x of [52, 280]) {
    pc.rect(x, 0, 10, SHOP_H, C.beam);
    pc.vline(x, 0, SHOP_H, C.beamLight);
    pc.vline(x + 9, 0, SHOP_H, C.beamDark);
  }
}

function nightWindow(pc) {
  const x = 72, y = 26, w = 42, h = 46;
  pc.rect(x - 3, y - 3, w + 6, h + 6, C.windowFrame);
  for (let j = y; j < y + h; j++) {
    for (let i = x; i < x + w; i++) pc.px(i, j, pc.dither(i, j, C.night, C.nightLight, (j - y) / h));
  }
  const rand = seeded(2);
  for (let k = 0; k < 10; k++) pc.px(x + Math.floor(rand() * w), y + Math.floor(rand() * h * 0.6), C.star);
  pc.ellipse(x + 30, y + 12, 5, 5, C.moon);
  pc.ellipse(x + 32, y + 11, 4, 4, C.night);
  // distant treeline through the glass
  for (let i = x; i < x + w; i++) {
    const top = y + h - 8 - Math.round(3 * Math.abs(Math.sin(i * 0.4)));
    pc.vline(i, top, y + h - 1, '#15281f');
  }
  pc.rect(x + w / 2 - 1, y, 2, h, C.windowFrame);
  pc.rect(x, y + h / 2 - 1, w, 2, C.windowFrame);
  pc.rect(x - 5, y + h + 2, w + 10, 3, C.sill);
  pc.hline(x - 5, x + w + 4, y + h + 2, C.sillLight);
}

function foldedStack(pc, x, y, count, rand) {
  for (let k = 0; k < count; k++) {
    const [c, d] = C.cloth[Math.floor(rand() * C.cloth.length)];
    const sy = y - (k + 1) * 4;
    pc.rect(x, sy, 16, 4, c);
    pc.hline(x, x + 15, sy + 3, d);
    pc.px(x + 15, sy + 1, d);
  }
}

function shelves(pc) {
  const rand = seeded(8);
  pc.rect(4, 72, 4, 56, C.shelfDark);
  pc.rect(48, 72, 4, 56, C.shelfDark);
  for (const y of [84, 104, 124]) {
    pc.rect(4, y, 48, 4, C.shelf);
    pc.hline(4, 51, y, C.shelfLight);
    pc.hline(4, 51, y + 3, C.shelfDark);
    foldedStack(pc, 9, y, 2 + Math.floor(rand() * 2), rand);
    foldedStack(pc, 29, y, 2 + Math.floor(rand() * 2), rand);
  }
}

function hangingShirt(pc, cx, top, [c, d]) {
  // hanger
  pc.px(cx, top - 4, C.hanger);
  pc.px(cx + 1, top - 5, C.hanger);
  pc.line(cx - 6, top, cx, top - 3, C.hanger);
  pc.line(cx + 6, top, cx, top - 3, C.hanger);
  // tee silhouette
  pc.poly([[cx - 6, top], [cx + 6, top], [cx + 11, top + 4], [cx + 9, top + 8], [cx + 6, top + 6], [cx + 6, top + 22], [cx - 6, top + 22], [cx - 6, top + 6], [cx - 9, top + 8], [cx - 11, top + 4]], (x) => (x > cx + 3 ? d : c));
  pc.hline(cx - 2, cx + 2, top, d);
  pc.hline(cx - 5, cx + 5, top + 21, d);
}

function rack(pc) {
  pc.rect(212, 30, 62, 2, C.pole);
  pc.vline(212, 30, 128, C.shelfDark);
  pc.vline(273, 30, 128, C.shelfDark);
  const shirts = [C.cloth[0], C.cloth[1], C.cloth[2], C.cloth[3]];
  [222, 236, 250, 264].forEach((cx, i) => hangingShirt(pc, cx + (i % 2), 36 + (i % 2) * 2, shirts[i]));
  // a second, lower rail of tunics
  pc.rect(212, 70, 62, 2, C.pole);
  [226, 244, 262].forEach((cx, i) => hangingShirt(pc, cx, 76, C.cloth[(i + 2) % C.cloth.length]));
}

function lantern(pc) {
  const x = 296, y = 62;
  pc.hline(x - 6, x, y, C.iron);
  pc.vline(x, y, y + 3, C.iron);
  pc.rect(x - 4, y + 4, 9, 2, C.iron);
  pc.rect(x - 3, y + 6, 7, 10, C.iron);
  pc.rect(x - 2, y + 7, 5, 8, C.lantern);
  pc.rect(x - 1, y + 9, 3, 4, C.lanternLight);
  pc.rect(x - 4, y + 16, 9, 2, C.iron);
}

function welcomeSign(pc) {
  const text = 'WELCOME';
  const w = textWidth(text) + 10, h = 11;
  const x = Math.round(SHOP_W / 2 - w / 2), y = 16;
  pc.line(x + 4, 12, x + 4, y, C.iron);
  pc.line(x + w - 5, 12, x + w - 5, y, C.iron);
  pc.rect(x - 1, y - 1, w + 2, h + 2, C.outline);
  pc.rect(x, y, w, h, C.sign);
  pc.hline(x, x + w - 1, y, C.signLight);
  drawText(pc, text, x + 5, y + 3, C.gold);
}

// Darken the edges so the light falls on EJ and the counter
function vignette(pc) {
  for (let y = 0; y < SHOP_H; y++) {
    for (let x = 0; x < SHOP_W; x++) {
      const dx = (x - SHOP_W / 2) / (SHOP_W / 2), dy = (y - 90) / 110;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 0.75) continue;
      const c = pc.get(x, y);
      if (!c) continue;
      // stepped (not smooth) so it keeps the flat pixel-art look
      const step = Math.min(3, Math.floor((d - 0.75) * 8));
      pc.px(x, y, mix(c, '#140a05', [0.15, 0.3, 0.45, 0.6][step]));
    }
  }
}

export function drawShopBack() {
  const pc = new PixelCanvas(SHOP_W, SHOP_H);
  wall(pc);
  nightWindow(pc);
  shelves(pc);
  rack(pc);
  beams(pc);
  lantern(pc);
  welcomeSign(pc);
  vignette(pc);
  return pc;
}

function candle(pc, x, y) {
  pc.rect(x - 4, y - 1, 9, 2, C.holder);
  pc.rect(x - 2, y - 10, 5, 9, C.candle);
  pc.vline(x + 2, y - 10, y - 2, C.candleShade);
  pc.px(x, y - 11, C.outline);
  pc.ellipse(x, y - 14, 2, 3, C.flame);
  pc.px(x, y - 14, C.flameCore);
}

function ledger(pc, x, y) {
  pc.rect(x, y - 3, 22, 3, C.book);
  pc.hline(x, x + 21, y - 3, C.bookLight);
  pc.rect(x + 1, y - 5, 20, 2, C.pages);
  pc.vline(x + 11, y - 5, y - 4, C.candleShade);
  // quill
  pc.line(x + 14, y - 6, x + 24, y - 16, C.quill);
  pc.line(x + 15, y - 6, x + 25, y - 15, C.candleShade);
}

function coins(pc, x, y) {
  for (let k = 0; k < 3; k++) {
    pc.rect(x, y - 2 - k * 2, 7, 2, k % 2 ? C.coinDark : C.coin);
  }
  pc.rect(x + 9, y - 2, 7, 2, C.coin);
}

export function drawCounter() {
  const pc = new PixelCanvas(SHOP_W, SHOP_H);
  const top = COUNTER_TOP;
  // countertop
  pc.rect(0, top, SHOP_W, 7, C.counterTop);
  pc.hline(0, SHOP_W, top, C.counterTopLight);
  pc.hline(0, SHOP_W, top + 1, C.counterTopLight);
  pc.rect(0, top + 7, SHOP_W, 2, C.counterEdge);
  pc.hline(0, SHOP_W, top + 9, C.outline);
  // front panels
  const n = valueNoise(13, 5);
  for (let y = top + 10; y < SHOP_H; y++) {
    for (let x = 0; x < SHOP_W; x++) {
      const panelX = x % 40;
      let c = n(x * 0.5, y * 2) > 0.4 ? C.counterPanel : C.counterFront;
      if (panelX === 0 || panelX === 39) c = C.counterShadow;
      else if (panelX === 1) c = C.counterPanelLight;
      if (y === top + 10) c = C.counterShadow;
      pc.px(x, y, c);
    }
  }
  // inset trim
  pc.hline(0, SHOP_W, top + 18, C.counterPanelLight);
  pc.hline(0, SHOP_W, top + 19, C.counterShadow);

  // things on the counter, kept clear of EJ's hands in the middle
  candle(pc, 58, top);
  ledger(pc, 80, top);
  coins(pc, 216, top);
  const rand = seeded(4);
  foldedStack(pc, 236, top, 3, rand);
  foldedStack(pc, 256, top, 2, rand);
  pc.outline(C.outline);
  return pc;
}
