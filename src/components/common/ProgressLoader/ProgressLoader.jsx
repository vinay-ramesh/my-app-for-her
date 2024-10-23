import styles from './ProgressLoader.module.css';

const ProgressLoader = () => {
  return (
    <div className={styles.select__indicator} aria-hidden="true">
      <span className={styles.css_b349s}></span>
      <span className={styles.css_b160s}></span>
      <span className={styles.css_b320s}></span>
    </div>
  );
};

export default ProgressLoader;
