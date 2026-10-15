// A tiny software canvas for drawing pixel art in code.
// It only touches a typed array, so it works in the browser and in Node.

function parseColor(hex) {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

const colorCache = new Map();
function rgb(hex) {
  let c = colorCache.get(hex);
  if (!c) {
    c = parseColor(hex);
    colorCache.set(hex, c);
  }
  return c;
}

export default class PixelCanvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.data = new Uint8ClampedArray(width * height * 4);
  }

  inside(x, y) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  px(x, y, color) {
    x = Math.round(x);
    y = Math.round(y);
    if (!color || !this.inside(x, y)) return;
    const [r, g, b] = rgb(color);
    const i = (y * this.width + x) * 4;
    this.data[i] = r;
    this.data[i + 1] = g;
    this.data[i + 2] = b;
    this.data[i + 3] = 255;
  }

  get(x, y) {
    if (!this.inside(x, y)) return null;
    const i = (y * this.width + x) * 4;
    if (this.data[i + 3] === 0) return null;
    return '#' + [this.data[i], this.data[i + 1], this.data[i + 2]].map((n) => n.toString(16).padStart(2, '0')).join('');
  }

  isFilled(x, y) {
    return this.inside(x, y) && this.data[(y * this.width + x) * 4 + 3] !== 0;
  }

  clear(x, y) {
    if (!this.inside(x, y)) return;
    this.data[(y * this.width + x) * 4 + 3] = 0;
  }

  rect(x, y, w, h, color) {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) this.px(i, j, color);
  }

  hline(x0, x1, y, color) {
    for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) this.px(x, y, color);
  }

  vline(x, y0, y1, color) {
    for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) this.px(x, y, color);
  }

  line(x0, y0, x1, y1, color) {
    x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      this.px(x0, y0, color);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }

  // Filled ellipse; `shade(x, y, nx, ny)` can return a colour per pixel
  // (nx, ny are -1..1 offsets from the centre) for simple lighting.
  ellipse(cx, cy, rx, ry, color) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        const nx = (x + 0.5 - cx) / rx, ny = (y + 0.5 - cy) / ry;
        if (nx * nx + ny * ny <= 1) this.px(x, y, typeof color === 'function' ? color(x, y, nx, ny) : color);
      }
    }
  }

  // Scanline polygon fill
  poly(points, color) {
    const ys = points.map((p) => p[1]);
    const minY = Math.floor(Math.min(...ys)), maxY = Math.ceil(Math.max(...ys));
    for (let y = minY; y <= maxY; y++) {
      const cy = y + 0.5;
      const xs = [];
      for (let i = 0; i < points.length; i++) {
        const [x0, y0] = points[i];
        const [x1, y1] = points[(i + 1) % points.length];
        if ((y0 <= cy && y1 > cy) || (y1 <= cy && y0 > cy)) {
          xs.push(x0 + ((cy - y0) / (y1 - y0)) * (x1 - x0));
        }
      }
      xs.sort((a, b) => a - b);
      for (let k = 0; k < xs.length; k += 2) {
        for (let x = Math.round(xs[k]); x < Math.round(xs[k + 1]); x++) {
          this.px(x, y, typeof color === 'function' ? color(x, y) : color);
        }
      }
    }
  }

  // Ordered 2x2 dither between two colours: t = 0 → a, t = 1 → b
  dither(x, y, a, b, t) {
    const threshold = [0.125, 0.625, 0.875, 0.375][(x & 1) + (y & 1) * 2];
    return t > threshold ? b : a;
  }

  // Draw a block of rows: each character maps through `palette`, '.' is skipped
  sprite(rows, x, y, palette, { flip = false } = {}) {
    rows.forEach((row, j) => {
      const chars = flip ? [...row].reverse() : [...row];
      chars.forEach((ch, i) => {
        if (ch !== '.' && palette[ch]) this.px(x + i, y + j, palette[ch]);
      });
    });
  }

  // Add a 1px outline around everything currently drawn
  outline(color, { diagonal = false } = {}) {
    const marks = [];
    const dirs = diagonal
      ? [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]
      : [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.isFilled(x, y)) continue;
        if (dirs.some(([dx, dy]) => this.isFilled(x + dx, y + dy))) marks.push([x, y]);
      }
    }
    marks.forEach(([x, y]) => this.px(x, y, color));
  }

  // Copy another canvas onto this one (transparent pixels are skipped)
  draw(other, ox, oy) {
    for (let y = 0; y < other.height; y++) {
      for (let x = 0; x < other.width; x++) {
        const i = (y * other.width + x) * 4;
        if (other.data[i + 3] === 0) continue;
        const tx = ox + x, ty = oy + y;
        if (!this.inside(tx, ty)) continue;
        const j = (ty * this.width + tx) * 4;
        this.data[j] = other.data[i];
        this.data[j + 1] = other.data[i + 1];
        this.data[j + 2] = other.data[i + 2];
        this.data[j + 3] = 255;
      }
    }
  }
}

export function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function mix(a, b, t) {
  const [r1, g1, b1] = rgb(a);
  const [r2, g2, b2] = rgb(b);
  const c = (x, y) => Math.round(x + (y - x) * t).toString(16).padStart(2, '0');
  return `#${c(r1, r2)}${c(g1, g2)}${c(b1, b2)}`;
}

// Smooth value noise in roughly -1..1, for organic patches (grass, wood grain)
export function valueNoise(seed, cell = 8) {
  const rand = seeded(seed);
  const table = Array.from({ length: 256 }, () => rand() * 2 - 1);
  const hash = (x, y) => table[((x * 73856093) ^ (y * 19349663)) & 255];
  const smooth = (t) => t * t * (3 - 2 * t);
  return (x, y) => {
    const fx = x / cell, fy = y / cell;
    const x0 = Math.floor(fx), y0 = Math.floor(fy);
    const tx = smooth(fx - x0), ty = smooth(fy - y0);
    const a = hash(x0, y0), b = hash(x0 + 1, y0), c = hash(x0, y0 + 1), d = hash(x0 + 1, y0 + 1);
    return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty;
  };
}
