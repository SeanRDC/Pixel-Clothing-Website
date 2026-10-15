import { buildCloudRects, STRIP_W, STRIP_H } from './clouds';
import styles from './Scene.module.css';

const LAYERS = [
  {
    name: 'far',
    seed: 7,
    count: 7,
    width: [26, 46],
    height: [6, 10],
    top: [20, 46],
    colors: { light: '#5d4176', mid: '#47315f', dark: '#3a2a55' },
  },
  {
    name: 'near',
    seed: 23,
    count: 5,
    width: [44, 78],
    height: [10, 17],
    top: [38, 72],
    colors: { light: '#87577f', mid: '#64406f', dark: '#4c3361' },
  },
].map((layer) => ({ ...layer, rects: buildCloudRects(layer) }));

// Fixed positions so server and client render the same stars
const STARS = [
  [4, 4], [9, 12], [14, 3], [19, 9], [24, 15], [29, 5], [35, 11], [41, 2],
  [46, 8], [52, 14], [57, 4], [63, 10], [67, 3], [80, 6], [85, 13], [89, 4],
  [94, 10], [98, 2], [32, 17], [60, 18], [78, 15], [12, 19], [48, 19], [92, 18],
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

export default function Scene({ image = '/assets/images/bg.png', children }) {
  return (
    <div className={styles.scene} aria-hidden="true">
      {/* Sized like background-size: cover, so overlays stay pinned to the painting */}
      <div className={styles.canvas}>
        <img className={styles.painting} src={image} alt="" fetchPriority="high" />
        <div className={styles.stars}>
          {STARS.map(([x, y], i) => (
            <span
              key={i}
              className={styles.star}
              style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${(i * 0.37) % 4}s` }}
            />
          ))}
        </div>
        <div className={styles.moonGlow} />
        {LAYERS.map((layer) => (
          <CloudLayer key={layer.name} layer={layer} />
        ))}
        {children}
      </div>
    </div>
  );
}
