import React, { memo } from 'react';
import ImageAssets from '../../../assets/imageAsset';
import styles from './SideBar.module.css';
import SideNavBarComp from '../SideNavBar';

const SideBar = ({ isOpen, handleOpen } = props) => {
  return (
    <div className={isOpen ? styles.sidebar_main : styles.sidebar_main_srink}>
      <div className="flex bg-indigo-900 py-7 px-4 justify-between items-center ">
        <img src={isOpen ? ImageAssets.side_bar_avatar : ImageAssets.side_bar_shrink_logo} alt="logo" />
        <img
          src={ImageAssets.menu_icon}
          alt=""
          className="cursor-pointer"
          onClick={() => {
            handleOpen();
          }}
        />
      </div>
      <div>
        <SideNavBarComp />{' '}
      </div>
    </div>
  );
};
export default memo(SideBar);
