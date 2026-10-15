// EJ the merchant, drawn waist-up on an 80x104 grid.
// Two layers: `body` stands behind the counter, `hands` sits in front of it.
import PixelCanvas, { seeded } from '../../lib/pixel/PixelCanvas';

export const EJ_W = 80;
export const EJ_H = 104;
// Sprite row where the counter top crosses her waist
export const EJ_COUNTER_Y = 92;
// Where a held-up tee goes, in sprite pixels
export const EJ_SHIRT_BOX = { x: 14, y: 59, w: 52, h: 46 };

const C = {
  outline: '#1a0f14',
  skin: '#f5cfa0', skinShade: '#dca878', skinDark: '#b8845a', skinLight: '#ffe6c4',
  hair: '#1b2440', hairLight: '#34447a', hairDark: '#0e1427',
  eye: '#0f1424', eyeWhite: '#ffffff', iris: '#33467a',
  mouth: '#6e2420', tongue: '#d45a44', teeth: '#fff4e4',
  blush: '#ef9a88',
  teal: '#1f4a52', tealLight: '#2e6a74', tealDark: '#14363c',
  collar: '#191a2a',
  leather: '#6b3a1a', leatherLight: '#8f5228', leatherDark: '#45240f',
  brass: '#c9963a', brassLight: '#f4d27a', brassDark: '#7a5418',
  fur: '#7a5a32', furLight: '#a5824e', furDark: '#53401f',
  bracer: '#6a5530', bracerLight: '#8c7444', bracerDark: '#4a3a1e',
};

const mirror = (x) => EJ_W - 1 - x;

function torso(pc) {
  pc.poly([[21, 60], [59, 60], [57, 104], [23, 104]], (x, y) => {
    if (x > 52) return (y - 60) % 4 === 0 ? C.teal : C.tealDark;
    return (y - 60) % 4 === 0 ? C.tealLight : C.teal;
  });
  // leather yoke and straps
  pc.rect(27, 58, 26, 4, C.leather);
  pc.hline(27, 52, 58, C.leatherLight);
  for (const x of [27, 50]) {
    pc.rect(x, 60, 4, 44, C.leather);
    pc.vline(x, 60, 103, C.leatherLight);
    pc.vline(x + 3, 60, 103, C.leatherDark);
  }
  // brass buckle on the chest
  pc.ellipse(29.5, 76, 3.5, 3.5, C.brass);
  pc.ellipse(29.5, 76, 1.6, 1.6, C.leatherDark);
  pc.px(28, 74, C.brassLight);
  pc.px(31, 78, C.brassDark);
  // collar
  pc.rect(32, 56, 16, 3, C.collar);
  pc.hline(33, 46, 59, C.collar);
}

function neck(pc) {
  pc.rect(35, 49, 10, 9, C.skin);
  pc.rect(35, 49, 10, 3, C.skinShade);
  pc.vline(44, 49, 57, C.skinShade);
}

function furPad(pc, cx, flip) {
  const rand = seeded(flip ? 31 : 17);
  pc.ellipse(cx, 63, 11, 7.5, (x, y, nx, ny) => {
    const r = rand();
    if (ny < -0.45) return r > 0.25 ? C.furLight : C.fur;
    if (ny > 0.45) return r > 0.3 ? C.furDark : C.fur;
    return r > 0.82 ? C.furLight : r < 0.12 ? C.furDark : C.fur;
  });
}

function upperArm(pc, side) {
  const m = side === 'left' ? (x) => x : mirror;
  pc.poly([[m(11), 66], [m(20), 66], [m(21), 85], [m(12), 86]].map(([x, y]) => [x, y]), (x) =>
    (side === 'left' ? x > 18 : x < 61) ? C.skinShade : C.skin);
}

// Forearm from the elbow down to the counter, wrapped in a leather bracer
function restingForearm(pc, side) {
  const m = side === 'left' ? (x) => x : mirror;
  pc.poly([[m(11), 84], [m(20), 83], [m(26), 94], [m(17), 97]], C.bracer);
  for (let k = 0; k < 3; k++) pc.line(m(15 + k * 2), 88 + k * 3, m(21 + k * 1), 87 + k * 3, C.bracerDark);
  pc.line(m(13), 86, m(18), 95, C.bracerLight);
}

// Forearm angled up so the hand meets the tee's shoulder at chest height
function raisedForearm(pc, side) {
  const m = side === 'left' ? (x) => x : mirror;
  const pts = [[11, 84], [20, 86], [22, 72], [14, 70]].map(([x, y]) => [m(x), y]);
  pc.poly(pts, C.bracer);
  for (let k = 0; k < 3; k++) pc.line(m(13), 82 - k * 4, m(20), 83 - k * 4, C.bracerDark);
  pc.line(m(12), 83, m(14), 72, C.bracerLight);
}

// Waving arm: up beside the head on her left (viewer's right)
function wavingArm(pc, frame) {
  pc.poly([[57, 64], [66, 62], [73, 51], [64, 47]], (x) => (x > 69 ? C.skinShade : C.skin));
  pc.poly([[65, 50], [72, 51], [74, 38], [67, 37]], C.bracer);
  pc.line(67, 46, 73, 47, C.bracerDark);
  pc.line(67, 42, 73, 43, C.bracerDark);
  const hx = 70 + (frame ? 2 : 0), hy = 31;
  pc.ellipse(hx, hy, 4, 4.5, C.skin);
  for (let f = 0; f < 4; f++) {
    const fx = hx - 3 + f * 2 + (frame ? 1 : 0);
    pc.vline(fx, hy - 8 + (f === 0 || f === 3 ? 2 : 0), hy - 3, C.skin);
  }
  pc.rect(hx - 6, hy - 1, 3, 2, C.skin);
  pc.vline(hx + 3, hy - 2, hy + 2, C.skinShade);
}

function head(pc, face) {
  // back of the bob, behind the face
  pc.ellipse(40, 27, 23, 23, C.hair);
  pc.poly([[16, 26], [26, 26], [27, 52], [19, 50], [17, 44]], C.hair);
  pc.poly([[64, 26], [54, 26], [53, 52], [61, 50], [63, 44]], C.hair);
  [[19, 51], [22, 53], [25, 54], [55, 54], [58, 53], [61, 51]].forEach(([x, y]) => pc.px(x, y, C.hairDark));

  // ears
  pc.ellipse(24.5, 38, 2.5, 4, C.skin);
  pc.px(24, 38, C.skinDark);
  pc.ellipse(55.5, 38, 2.5, 4, C.skinShade);

  // face
  pc.poly([[25, 23], [55, 23], [55, 41], [50, 49], [44, 52], [36, 52], [30, 49], [25, 41]], (x, y) => {
    if (x >= 52 && y > 30) return C.skinShade;
    if (y > 48) return C.skinShade;
    return C.skin;
  });

  // nose
  pc.px(40, 42, C.skinShade);
  pc.px(41, 42, C.skinDark);

  // cheeks
  const blush = face.happy ? 0.85 : 0.35;
  for (const cx of [30, 48]) {
    for (let y = 43; y <= 44; y++) for (let x = cx; x < cx + 4; x++) pc.px(x, y, pc.dither(x, y, C.skin, C.blush, blush));
  }

  eyes(pc, face);
  mouth(pc, face);
  bangs(pc);
}

function eyes(pc, { blink, happy }) {
  const P = { K: C.eye, W: C.eyeWhite, I: C.iris };
  const open = [
    '.KKKKKK',
    'KKWWKKK',
    'KKWWKKK',
    'KKKKIIK',
    'KKKKIWK',
    '.KKKKK.',
  ];
  const closed = [
    '.......',
    '.......',
    'K.....K',
    '.KKKKK.',
    '.......',
    '.......',
  ];
  const smiling = [
    '.......',
    '..KKK..',
    '.KK.KK.',
    'KK...KK',
    '.......',
    '.......',
  ];
  const rows = happy ? smiling : blink ? closed : open;
  pc.sprite(rows, 28, 32, P);
  pc.sprite(rows, 45, 32, P, { flip: true });
  if (!happy && !blink) {
    // re-place highlights on the right eye so both catch light from the same side
    pc.sprite(['..WW', '..WW'], 45, 33, P);
    pc.rect(48, 33, 2, 2, C.eye);
  }
  // lash flicks
  pc.px(27, 32, C.eye);
  pc.px(52, 32, C.eye);
}

function mouth(pc, { mouthShape }) {
  const M = C.mouth;
  if (mouthShape === 'open') {
    pc.hline(38, 42, 45, M);
    pc.rect(37, 46, 7, 2, M);
    pc.rect(38, 46, 5, 2, C.tongue);
    pc.hline(38, 42, 48, M);
  } else if (mouthShape === 'grin') {
    pc.hline(36, 44, 45, M);
    pc.rect(36, 46, 9, 2, M);
    pc.hline(37, 43, 46, C.teeth);
    pc.rect(38, 47, 5, 1, C.tongue);
    pc.hline(37, 43, 48, M);
  } else {
    pc.px(37, 45, M);
    pc.px(43, 45, M);
    pc.hline(38, 42, 46, M);
  }
}

function bangs(pc) {
  // jagged fringe: how far each column of hair reaches down the forehead
  const reach = {
    24: 34, 25: 33, 26: 30, 27: 28, 28: 30, 29: 32, 30: 31, 31: 28, 32: 27, 33: 28,
    34: 29, 35: 31, 36: 30, 37: 28, 38: 27, 39: 29, 40: 32, 41: 33, 42: 30, 43: 28,
    44: 27, 45: 28, 46: 30, 47: 29, 48: 27, 49: 28, 50: 30, 51: 31, 52: 29, 53: 30,
    54: 33, 55: 35, 56: 34,
  };
  for (const [x, bottom] of Object.entries(reach)) pc.vline(Number(x), 8, bottom, C.hair);
  // strand shading
  [[33, 14, 26], [39, 12, 27], [46, 13, 27], [52, 16, 28]].forEach(([x, y0, y1]) => pc.vline(x, y0, y1, C.hairDark));
  // sheen on the crown
  for (let y = 4; y < 30; y++) {
    for (let x = 18; x < 62; x++) {
      const d = Math.hypot(x - 34, y - 16);
      if (d > 8.5 && d < 10 && y < 18 && pc.get(x, y) === C.hair) pc.px(x, y, C.hairLight);
    }
  }
  // messy tufts on top
  [[33, 4], [34, 3], [35, 4], [40, 2], [41, 3], [46, 3], [47, 4], [28, 7], [52, 7]].forEach(([x, y]) => pc.px(x, y, C.hair));
}

// Hand resting flat on the counter, fingers toward the viewer
function restingHand(pc, side) {
  const m = side === 'left' ? (x) => x : mirror;
  pc.sprite([
    '..SSSSSS..',
    '.SSSSSSSS.',
    'TSSSSSSSSs',
    'TTSsSsSsSs',
    '.T.s.s.s..',
  ], side === 'left' ? 17 : EJ_W - 27, 93, { S: C.skin, s: C.skinShade, T: C.skin }, { flip: side !== 'left' });
}

// Fist pinching the tee's shoulder; fingers curl over the fabric
function holdingHand(pc, side) {
  const m = side === 'left' ? (x) => x : mirror;
  pc.ellipse(m(18), 69, 4.5, 4.5, C.skin);
  for (let y = 66; y <= 72; y += 2) pc.hline(m(20), m(23), y, C.skin);
  for (let y = 67; y <= 71; y += 2) pc.px(m(22), y, C.skinShade);
  pc.vline(m(14), 67, 71, C.skinShade);
}

/**
 * pose: 'idle' | 'wave' | 'present'
 * face: { blink, happy, mouthShape: 'smile' | 'open' | 'grin' }
 * breath: 0 | 1 (the upper body sinks a pixel on the out-breath)
 */
export function drawEJ({ pose = 'idle', waveFrame = 0, breath = 0, face = {} } = {}) {
  const upper = new PixelCanvas(EJ_W, EJ_H);
  torso(upper);
  neck(upper);
  upperArm(upper, 'left');
  if (pose !== 'wave') upperArm(upper, 'right');
  furPad(upper, 21, false);
  furPad(upper, 59, true);
  head(upper, { mouthShape: 'smile', ...face });

  const body = new PixelCanvas(EJ_W, EJ_H);
  if (pose !== 'present') {
    restingForearm(body, 'left');
    if (pose === 'idle') restingForearm(body, 'right');
  }
  body.draw(upper, 0, breath);
  if (pose === 'present') {
    raisedForearm(body, 'left');
    raisedForearm(body, 'right');
  }
  if (pose === 'wave') wavingArm(body, waveFrame);
  body.outline(C.outline);

  const hands = new PixelCanvas(EJ_W, EJ_H);
  if (pose === 'present') {
    holdingHand(hands, 'left');
    holdingHand(hands, 'right');
  } else {
    restingHand(hands, 'left');
    if (pose === 'idle') restingHand(hands, 'right');
  }
  hands.outline(C.outline);

  return { body, hands };
}

// Preview helper: body + hands on one canvas
export function drawEJPreview(opts) {
  const { body, hands } = drawEJ(opts || {});
  const out = new PixelCanvas(EJ_W, EJ_H);
  out.draw(body, 0, 0);
  out.draw(hands, 0, 0);
  return out;
}
