import React, { useContext } from 'react';
import ImageAssets from '../../../../assets/imageAsset';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';
import { sideBarLayout } from '../../../layout/layout';
import { toast, Toaster } from 'react-hot-toast';

const SideBarFooter = () => {
  const navigate = useNavigate();
  const { isOpen } = useContext(sideBarLayout);

  const handleLogout = () => {
    const logoutToast = toast.loading('Logging out!!');
    window.localStorage.clear();
    setTimeout(() => {
      navigate('/');
      toast.success('Logged out successfully', { id: logoutToast, duration: 2000 });
    }, 2000);
  };

  return (
    <div className={styles.menuitem_main}>
      <button type="button" onClick={handleLogout} className={styles.menu_inactive}>
        <img src={ImageAssets.logouticon} alt="" className={` ${styles.imagemenu} ${!isOpen ? ' max-w-6' : null}`} />

        {isOpen ? <div className=" font-medium text-md sm:text-xl md:text-xl 2xl:text-xl  tracking-wider">{'Logout'}</div> : null}
      </button>
      {isOpen ? <div className="   font-medium text-xs  tracking-wider">{'2024 © Read analytics'}</div> : null}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};
export default SideBarFooter;
