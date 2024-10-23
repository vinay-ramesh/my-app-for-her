import React, { useState } from 'react';
import ImageAssets from '../../../assets/imageAsset';
import { useType } from '../../../utils/deviceType';

import styles from './Drawer.module.css';

const Drawer = ({ children }) => {
  const deviceType = useType();

  return (
    <div className={deviceType === 'mobile' ? styles.drawermain : styles.drawermain}>
      <div className={styles.wraper}>{children}</div>
    </div>
  );
};

export default Drawer;
