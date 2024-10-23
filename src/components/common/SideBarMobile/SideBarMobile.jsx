import React, { memo } from 'react';
import ImageAssets from '../../../assets/imageAsset';
import styles from './SideBarMobile.module.css';
import { useType } from '../../../utils/deviceType';

const SideBarMob = ({ handleOpen } = props) => {
  const deviceType = useType();
  return (
    <div className={styles.sidebar_main}>
      <div className="flex bg-indigo-900 py-7 px-4 justify-between items-center  ">
        <img src={ImageAssets.side_bar_avatar} alt="logo" />

        <img
          src={ImageAssets.menu_icon}
          alt=""
          className=" cursor-pointer"
          onClick={() => {
            handleOpen();
          }}
        />
      </div>
    </div>
  );
};

export default memo(SideBarMob);
