import PixelIcon from './PixelIcon';
import styles from './IconButton.module.css';

export default function IconButton({ icon, label, badge, className = '', ...props }) {
  return (
    <button type="button" className={`${styles.button} ${className}`} aria-label={label} title={label} {...props}>
      <PixelIcon name={icon} className={styles.icon} />
      {badge ? <span className={styles.badge}>{badge}</span> : null}
    </button>
  );
}
