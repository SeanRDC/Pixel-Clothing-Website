// The title screen: a night-time riverside with the Clothing Merchant's house.
// Drawn on a 320x180 grid; every coordinate below is in art pixels.
import PixelCanvas, { seeded, mix, valueNoise } from '../../lib/pixel/PixelCanvas';
import { drawText, textWidth } from '../../lib/pixel/font';

export const SCENE_W = 320;
export const SCENE_H = 180;

// Points the animated overlays line up with (as % of the scene)
export const ANCHORS = {
  moon: { x: (244 / SCENE_W) * 100, y: (34 / SCENE_H) * 100 },
  lantern: { x: (229 / SCENE_W) * 100, y: (121 / SCENE_H) * 100 },
  windows: [
    { x: (218 / SCENE_W) * 100, y: (125 / SCENE_H) * 100 },
    { x: (262 / SCENE_W) * 100, y: (125 / SCENE_H) * 100 },
  ],
};

const C = {
  outline: '#140c1c',
  sky: ['#14132c', '#1b1838', '#241f45', '#2f2550', '#3b2a58', '#4b3260', '#5a3a66'],
  moon: '#f4d77a', moonLight: '#fff1b8', moonShade: '#d9b45a', moonCrater: '#e3c063',
  hillFar: '#2b2347', hillNear: '#322a4e',
  treeFar: '#16302a', treeFarHi: '#1f4236',
  treeMid: '#1b3a2c', treeMidHi: '#2a5640',
  treeNear: '#14281f', treeNearHi: '#24473a',
  grass: '#24482a', grassDark: '#1b3922', grassLight: '#2f5a30', grassTip: '#41703a', warmGrass: '#5a6a34',
  dirt: '#7a5a34', dirtDark: '#5a3f22',
  water: '#2a3d78', waterDeep: '#223268', waterLight: '#3f5a9e', waterGlint: '#8fb0e8',
  bank: '#5e4628',
  plaster: '#dcc7a0', plasterShade: '#c2aa7e', plasterSide: '#a9916a',
  beam: '#4a2c18', beamDark: '#2e1a0e',
  roof: '#3b3459', roofLight: '#4d4572', roofDark: '#2a2442',
  stone: '#5f5868', stoneLight: '#7a7385', stoneDark: '#433d4c',
  glass: '#f6c85f', glassLight: '#ffe7a0', glassDark: '#d9963a',
  door: '#6b3a1a', doorDark: '#4a2814', gold: '#f4c26f',
  bush: '#2a5a2c', bushLight: '#3d7a36', bushDark: '#1d4220',
  flowerPink: '#e8829a', flowerYellow: '#f4d26a', flowerWhite: '#f2ecd8',
};

function sky(pc) {
  const bands = C.sky;
  for (let y = 0; y < 110; y++) {
    const t = Math.min(y / 96, 1) * (bands.length - 1);
    const i = Math.floor(t);
    const a = bands[i], b = bands[Math.min(i + 1, bands.length - 1)];
    for (let x = 0; x < SCENE_W; x++) pc.px(x, y, pc.dither(x, y, a, b, t - i));
  }
  // static faint stars (the twinkling ones are an overlay)
  const rand = seeded(11);
  for (let n = 0; n < 70; n++) {
    const x = Math.floor(rand() * SCENE_W), y = Math.floor(rand() * 60);
    pc.px(x, y, rand() > 0.7 ? '#cfc6ff' : '#6e64a8');
  }
}

function moon(pc) {
  const cx = 244, cy = 34, r = 11;
  // soft halo rings
  for (let ring = 3; ring >= 1; ring--) {
    pc.ellipse(cx, cy, r + ring * 3, r + ring * 3, (x, y) =>
      pc.dither(x, y, pc.get(x, y) || C.sky[1], mix(C.sky[2], '#8a7aa8', 0.25 + (3 - ring) * 0.12), 0.5));
  }
  pc.ellipse(cx, cy, r, r, (x, y, nx, ny) => {
    if (nx + ny < -0.9) return C.moonLight;
    if (nx + ny > 0.8) return C.moonShade;
    return C.moon;
  });
  [[240, 30, 2.2], [248, 38, 1.6], [246, 27, 1.2], [238, 39, 1.4]].forEach(([x, y, rr]) =>
    pc.ellipse(x, y, rr, rr, C.moonCrater));
}

function bumpyTop(x, base, amp, freq, seed) {
  return base - amp * (0.5 + 0.5 * Math.sin(x * freq + seed)) - (amp / 2) * (0.5 + 0.5 * Math.sin(x * freq * 2.7 + seed * 3));
}

function hills(pc) {
  for (let x = 0; x < SCENE_W; x++) {
    const top = Math.round(88 - 10 * (0.5 + 0.5 * Math.sin(x / 38 + 1)) - 6 * Math.sin(x / 17));
    for (let y = top; y < 110; y++) pc.px(x, y, y === top ? mix(C.hillFar, '#4a3d6e', 0.6) : C.hillFar);
  }
}

// A row of rounded tree crowns
function treeRow(pc, { base, amp, freq, seed, color, light, bottom }) {
  for (let x = 0; x < SCENE_W; x++) {
    const top = Math.round(bumpyTop(x, base, amp, freq, seed));
    for (let y = top; y < bottom; y++) {
      const edge = y - top;
      pc.px(x, y, edge < 2 && (x + y) % 3 !== 0 ? light : color);
    }
  }
}

function pine(pc, cx, baseY, h, color, light) {
  const layers = Math.floor(h / 7);
  for (let l = 0; l < layers; l++) {
    const top = baseY - h + l * 6;
    const half = 3 + l * 2.2;
    pc.poly([[cx, top], [cx + half, top + 9], [cx - half, top + 9]], (x) => (x < cx - 1 ? light : color));
  }
  pc.rect(cx - 1, baseY - 2, 2, 4, '#2e1d14');
}

function trees(pc) {
  treeRow(pc, { base: 92, amp: 9, freq: 0.21, seed: 2, color: C.treeFar, light: C.treeFarHi, bottom: 112 });
  treeRow(pc, { base: 100, amp: 8, freq: 0.33, seed: 7, color: C.treeMid, light: C.treeMidHi, bottom: 114 });
  // tall pines framing the left edge
  const rand = seeded(5);
  [[8, 104, 70], [24, 106, 58], [40, 104, 48], [58, 108, 36], [302, 106, 52], [316, 108, 64]].forEach(([x, y, h]) =>
    pine(pc, x, y, h, rand() > 0.5 ? C.treeNear : C.treeMid, C.treeNearHi));
  // round trees behind the house
  pc.ellipse(296, 92, 18, 16, (x, y, nx, ny) => (nx + ny < -0.6 ? C.treeMidHi : C.treeMid));
  pc.ellipse(190, 96, 12, 11, (x, y, nx, ny) => (nx + ny < -0.6 ? C.treeMidHi : C.treeMid));
}

function riverCenter(y) {
  // winds from the far bank (top middle) down to the bottom left
  const t = (y - 104) / 76;
  return 168 - 70 * t - 26 * Math.sin(t * 3.4);
}

function riverHalfWidth(y) {
  const t = (y - 104) / 76;
  return 3 + t * 46;
}

function ground(pc) {
  const rand = seeded(3);
  const big = valueNoise(4, 14), small = valueNoise(8, 4);
  for (let y = 104; y < SCENE_H; y++) {
    for (let x = 0; x < SCENE_W; x++) {
      const n = big(x, y * 1.6) * 0.75 + small(x, y) * 0.35;
      let c = n > 0.38 ? C.grassLight : n < -0.32 ? C.grassDark : C.grass;
      if (Math.abs(n - 0.38) < 0.05 || Math.abs(n + 0.32) < 0.05) c = pc.dither(x, y, C.grass, c, 0.5);
      if (y < 108) c = mix(c, C.treeMid, (108 - y) / 5);
      pc.px(x, y, c);
    }
  }
  // grass tufts
  for (let n = 0; n < 260; n++) {
    const x = Math.floor(rand() * SCENE_W), y = 108 + Math.floor(rand() * 72);
    pc.px(x, y, C.grassTip);
    pc.px(x, y - 1, C.grassLight);
  }
}

function river(pc) {
  for (let y = 104; y < SCENE_H; y++) {
    const cx = riverCenter(y), hw = riverHalfWidth(y);
    const left = Math.round(cx - hw), right = Math.round(cx + hw);
    for (let x = left - 2; x <= right + 2; x++) {
      if (x < left || x > right) {
        pc.px(x, y, x === left - 1 || x === right + 1 ? C.bank : C.dirtDark);
        continue;
      }
      const d = Math.abs(x - cx) / hw;
      let c = d < 0.45 ? C.waterDeep : C.water;
      // flowing highlight streaks
      const streak = Math.sin((x - cx) * 0.5 + y * 0.9) + Math.sin(y * 0.37 + x * 0.05);
      if (streak > 1.6) c = C.waterLight;
      pc.px(x, y, c);
    }
  }
  // moon reflection
  for (let y = 112; y < 150; y += 3) {
    const cx = Math.round(riverCenter(y) + 6);
    pc.hline(cx - 1, cx + 1 + ((y / 3) % 2), y, C.waterGlint);
  }
}

function path(pc) {
  // dirt path from the door down to the river bank
  for (let y = 140; y < 168; y++) {
    const t = (y - 140) / 28;
    const cx = Math.round(240 - t * 62 - Math.sin(t * 3) * 10);
    const hw = 5 + t * 5;
    for (let x = Math.round(cx - hw); x <= cx + hw; x++) {
      pc.px(x, y, (x + y) % 5 === 0 ? C.dirtDark : C.dirt);
    }
  }
}

function house(pc) {
  const L = 204, R = 276, T = 98, B = 140;

  // side wing in shadow
  pc.rect(R, 108, 22, B - 108, C.plasterSide);
  pc.poly([[R - 2, 104], [R + 26, 108], [R + 26, 112], [R - 2, 110]], C.roofDark);
  pc.rect(R + 6, 118, 9, 10, C.glassDark);
  pc.rect(R + 10, 118, 1, 10, C.beam);

  // front wall
  pc.rect(L, T, R - L, B - T, C.plaster);
  for (let x = L; x < R; x++) pc.px(x, B - 1, C.plasterShade);
  pc.rect(L, T + 26, R - L, 1, C.plasterShade);

  // gable
  pc.poly([[L - 2, T], [240, 64], [R + 2, T]], C.plaster);
  // timber frame
  pc.rect(L, T, 3, B - T, C.beam);
  pc.rect(R - 3, T, 3, B - T, C.beam);
  pc.rect(L, T, R - L, 3, C.beam);
  pc.rect(L, T + 16, R - L, 2, C.beam);
  pc.rect(239, 70, 2, T - 70, C.beam);
  pc.line(L + 4, T - 1, 238, 72, C.beam);
  pc.line(L + 5, T - 1, 238, 73, C.beam);
  pc.line(R - 4, T - 1, 241, 72, C.beam);
  pc.line(R - 5, T - 1, 241, 73, C.beam);

  // round gable window
  pc.ellipse(240, 84, 5, 5, C.beamDark);
  pc.ellipse(240, 84, 4, 4, (x, y, nx, ny) => (nx + ny < -0.3 ? C.glassLight : C.glass));
  pc.rect(239, 80, 2, 8, C.beam);

  // roof: two thick slanted bands with shingle rows
  const roofBand = (sx, sy, ex, ey) => {
    for (let k = 0; k < 11; k++) {
      const c = k === 0 ? C.roofLight : k >= 9 ? C.outline : (k % 3 === 0 ? C.roofDark : C.roof);
      pc.line(sx, sy + k, ex, ey + k, c);
      pc.line(sx, sy + k + 0.5, ex, ey + k + 0.5, c);
    }
  };
  roofBand(240, 56, L - 10, T + 2);
  roofBand(240, 56, R + 10, T + 2);
  pc.rect(237, 54, 6, 4, C.roofLight);

  // chimney
  pc.rect(214, 62, 8, 18, C.stone);
  pc.rect(214, 62, 8, 2, C.stoneLight);
  pc.rect(213, 60, 10, 3, C.stoneDark);
  for (let y = 66; y < 78; y += 4) pc.hline(214, 221, y, C.stoneDark);

  // shop sign
  const sx = 214, sy = 101, sw = 52, sh = 14;
  pc.rect(sx - 1, sy - 1, sw + 2, sh + 2, C.outline);
  pc.rect(sx, sy, sw, sh, '#3a2414');
  pc.hline(sx, sx + sw - 1, sy, '#5a3a1e');
  drawText(pc, 'CLOTHING', 240 - Math.floor(textWidth('CLOTHING') / 2), sy + 2, C.gold);
  drawText(pc, 'MERCHANT', 240 - Math.floor(textWidth('MERCHANT') / 2), sy + 8, C.gold);

  // door with an arched top
  const dx = 233, dy = 120;
  pc.rect(dx - 1, dy + 2, 16, B - dy - 2, C.beamDark);
  pc.ellipse(dx + 7, dy + 4, 8, 5, C.beamDark);
  pc.rect(dx, dy + 3, 14, B - dy - 3, C.door);
  pc.ellipse(dx + 7, dy + 4, 7, 4, C.door);
  for (let x = dx + 3; x < dx + 14; x += 4) pc.vline(x, dy + 1, B - 1, C.doorDark);
  pc.px(dx + 11, dy + 12, C.gold);

  // windows
  const win = (wx, wy) => {
    pc.rect(wx - 1, wy - 1, 16, 15, C.beamDark);
    pc.rect(wx, wy, 14, 13, C.glass);
    pc.rect(wx, wy, 6, 5, C.glassLight);
    pc.rect(wx + 6, wy, 2, 13, C.beam);
    pc.rect(wx, wy + 6, 14, 1, C.beam);
    pc.rect(wx - 2, wy + 13, 18, 2, C.beam);
  };
  win(211, 120);
  win(255, 120);

  // lantern on a bracket by the door
  pc.hline(226, 231, 116, C.beamDark);
  pc.vline(229, 116, 118, C.beamDark);
  pc.rect(227, 119, 5, 6, C.beamDark);
  pc.rect(228, 120, 3, 4, '#ffb347');
  pc.px(229, 121, '#fff1b8');

  // stone foundation
  for (let x = L - 2; x < R + 22; x += 4) {
    pc.rect(x, B, 3, 3, (x / 4) % 2 ? C.stone : C.stoneLight);
    pc.px(x + 3, B + 1, C.stoneDark);
  }
}

function lightSpill(pc) {
  const pools = [[218, 144, 16, 7], [262, 144, 16, 7], [240, 145, 12, 8]];
  for (const [cx, cy, rx, ry] of pools) {
    for (let y = cy - ry; y <= cy + ry; y++) {
      for (let x = cx - rx; x <= cx + rx; x++) {
        const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
        const cur = pc.get(x, y);
        if (d > 1 || !cur || cur === C.dirt || cur === C.dirtDark) continue;
        pc.px(x, y, pc.dither(x, y, cur, C.warmGrass, (1 - d) * 0.9));
      }
    }
  }
}

function bushes(pc) {
  const bush = (cx, cy, rx, ry) =>
    pc.ellipse(cx, cy, rx, ry, (x, y, nx, ny) => (nx + ny < -0.5 ? C.bushLight : ny > 0.5 ? C.bushDark : C.bush));
  bush(201, 140, 7, 5);
  bush(209, 142, 6, 4);
  bush(281, 141, 8, 5);
  bush(292, 139, 7, 6);
  bush(140, 112, 6, 4);
  bush(30, 150, 12, 8);
  bush(14, 156, 10, 7);
  const rand = seeded(9);
  for (let n = 0; n < 40; n++) {
    const x = 180 + Math.floor(rand() * 135), y = 142 + Math.floor(rand() * 36);
    const c = [C.flowerPink, C.flowerYellow, C.flowerWhite][n % 3];
    if (!pc.get(x, y) || pc.get(x, y).startsWith('#2') || pc.get(x, y).startsWith('#3')) pc.px(x, y, c);
  }
}

export function drawNightScene() {
  const pc = new PixelCanvas(SCENE_W, SCENE_H);
  sky(pc);
  moon(pc);
  hills(pc);
  trees(pc);
  ground(pc);
  river(pc);
  lightSpill(pc);
  path(pc);
  house(pc);
  bushes(pc);
  return pc;
}
