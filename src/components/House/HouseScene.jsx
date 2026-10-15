"use client";
import PixelArt from '../ui/PixelArt';
import EJ from './EJ';
import { drawShopBack, drawCounter, SHOP_W, SHOP_H, EJ_POS, SHOP_ANCHORS } from './houseScene';
import { EJ_W, EJ_H, EJ_SHIRT_BOX } from './ej';
import styles from './HouseScene.module.css';

const pct = (v, total) => `${(v / total) * 100}%`;

const ejBox = {
  left: pct(EJ_POS.x, SHOP_W),
  top: pct(EJ_POS.y, SHOP_H),
  width: pct(EJ_W, SHOP_W),
  height: pct(EJ_H, SHOP_H),
};

const shirtBox = {
  left: pct(EJ_POS.x + EJ_SHIRT_BOX.x, SHOP_W),
  top: pct(EJ_POS.y + EJ_SHIRT_BOX.y, SHOP_H),
  width: pct(EJ_SHIRT_BOX.w, SHOP_W),
  height: pct(EJ_SHIRT_BOX.h, SHOP_H),
};

const at = ({ x, y }) => ({ left: `${x}%`, top: `${y}%` });

const MOTES = [[20, 40], [30, 62], [46, 30], [62, 50], [74, 34], [84, 58], [12, 70], [90, 22]];

/**
 * The shop interior with EJ behind the counter.
 * `shirt` ({ src, alt }) is shown held up in EJ's hands.
 */
export default function HouseScene({ pose = 'idle', talking = false, happy = false, shirt = null, showEJ = true }) {
  const hop = happy ? styles.hop : '';
  return (
    <div className={styles.scene}>
      <div className={styles.canvas}>
        <PixelArt draw={drawShopBack} width={SHOP_W} height={SHOP_H} className={styles.layer} />
        <div className={styles.lantern} style={at(SHOP_ANCHORS.lantern)} />
        <div className={styles.window} style={at(SHOP_ANCHORS.window)} />

        {showEJ && <EJ
          pose={pose}
          talking={talking}
          happy={happy}
          bodyClassName={`${styles.ej} ${styles.ejBody} ${hop}`}
          handsClassName={`${styles.ej} ${styles.ejHands} ${hop}`}
          bodyStyle={ejBox}
          handsStyle={ejBox}
        />}

        <PixelArt draw={drawCounter} width={SHOP_W} height={SHOP_H} className={`${styles.layer} ${styles.counter}`} />
        <div className={styles.candle} style={at(SHOP_ANCHORS.candle)} />

        {shirt && (
          <div key={shirt.src} className={`${styles.shirt} ${hop}`} style={shirtBox}>
            <img src={shirt.src} alt={shirt.alt} />
          </div>
        )}

        {MOTES.map(([x, y], i) => (
          <span key={i} className={styles.mote} style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 1.1}s` }} />
        ))}
      </div>
    </div>
  );
}
