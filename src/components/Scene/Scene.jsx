import { buildCloudRects, STRIP_W, STRIP_H } from './clouds';
import { drawNightScene, ANCHORS } from './nightScene';
import PixelArt from '../ui/PixelArt';
import styles from './Scene.module.css';

const LAYERS = [
  {
    name: 'far',
    seed: 7,
    count: 7,
    width: [24, 42],
    height: [5, 9],
    top: [16, 40],
    colors: { light: '#5d4176', mid: '#47315f', dark: '#3a2a55' },
  },
  {
    name: 'near',
    seed: 23,
    count: 5,
    width: [40, 70],
    height: [9, 15],
    top: [32, 62],
    colors: { light: '#87577f', mid: '#64406f', dark: '#4c3361' },
  },
].map((layer) => ({ ...layer, rects: buildCloudRects(layer) }));

// Fixed positions so server and client render the same
const STARS = [
  [4, 4], [9, 12], [14, 3], [19, 9], [24, 15], [29, 5], [35, 11], [41, 2],
  [46, 8], [52, 14], [57, 4], [63, 10], [67, 3], [82, 6], [86, 13], [90, 4],
  [94, 10], [98, 2], [32, 17], [60, 18], [79, 2], [12, 19], [48, 19], [92, 18],
];

const FIREFLIES = [
  [62, 74], [70, 86], [86, 80], [92, 70], [16, 70], [30, 88], [54, 92], [78, 94],
];

function CloudLayer({ layer }) {
  const id = `cloud-${layer.name}`;
  return (
    <div className={`${styles.cloudLayer} ${styles[layer.name]}`}>
      <svg
        className={styles.cloudTrack}
        viewBox={`0 0 ${STRIP_W * 2} ${STRIP_H}`}
        preserveAspectRatio="none"
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        <g id={id}>
          {layer.rects.map((r) => (
            <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height={1} fill={layer.colors[r.tone]} />
          ))}
        </g>
        <use href={`#${id}`} x={STRIP_W} />
      </svg>
    </div>
  );
}

const at = ({ x, y }) => ({ left: `${x}%`, top: `${y}%` });

export default function Scene() {
  return (
    <div className={styles.scene} aria-hidden="true">
      {/* Sized like background-size: cover, so overlays stay pinned to the art */}
      <div className={styles.canvas}>
        <PixelArt draw={drawNightScene} width={320} height={180} className={styles.painting} />
        <div className={styles.stars}>
          {STARS.map(([x, y], i) => (
            <span
              key={i}
              className={styles.star}
              style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${(i * 0.37) % 4}s` }}
            />
          ))}
        </div>
        <div className={styles.moonGlow} style={at(ANCHORS.moon)} />
        {LAYERS.map((layer) => (
          <CloudLayer key={layer.name} layer={layer} />
        ))}
        <div className={styles.lantern} style={at(ANCHORS.lantern)} />
        {ANCHORS.windows.map((w, i) => (
          <div key={i} className={styles.window} style={{ ...at(w), animationDelay: `${i * 1.3}s` }} />
        ))}
        {FIREFLIES.map(([x, y], i) => (
          <span
            key={i}
            className={styles.firefly}
            style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${(i * 0.9) % 6}s`, animationDuration: `${5 + (i % 3)}s` }}
          />
        ))}
      </div>
    </div>
  );
}
