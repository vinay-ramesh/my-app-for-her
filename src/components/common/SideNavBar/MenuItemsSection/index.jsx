import React, { useContext } from 'react';
import ImageAssets from '../../../../assets/imageAsset';
import { menuItems } from '../../../../App';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './index.module.css';
import { sideBarLayout } from '../../../layout/layout';
import { useType } from '../../../../utils/deviceType';

const MenuItem = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const deviceType = useType();
  const { isOpen, SetisOpen } = useContext(sideBarLayout);
  return (
    <div
      className={
        deviceType === 'mobile'
          ? isOpen
            ? styles.menuitem_mainmob
            : styles.menuitem_mainmob
          : isOpen
            ? styles.menuitem_main
            : styles.menuitem_mainopen
      }
    >
      {menuItems.map((i, index) => (
        <button
          key={index}
          type="button"
          onClick={() => {
            navigate(i.path);
            if (deviceType === 'mobile') {
              SetisOpen(false);
            }
          }}
          className={i.activePaths.includes(location.pathname.split('/')?.[1]) ? styles.menu_active : styles.menu_inactive}
        >
          <img
            src={i.icon}
            alt=""
            className={`${i.activePaths.includes(location.pathname.split('/')?.[1]) ? styles.imagemenu_active : styles.imagemenu} ${!isOpen ? ' max-w-6' : null} self-stretch`}
          />

          {isOpen ? <div className="  font-medium text-md sm:text-xl md:text-xl 2xl:text-xl  tracking-wider">{i.name}</div> : null}
        </button>
      ))}
    </div>
  );
};
export default MenuItem;
