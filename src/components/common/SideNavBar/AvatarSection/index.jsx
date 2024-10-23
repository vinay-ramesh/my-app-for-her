import React, { useContext } from 'react';
import ImageAssets from '../../../../assets/imageAsset';
import { sideBarLayout } from '../../../layout/layout';
import secureLocalStorage from 'react-secure-storage';

const AvatarSection = () => {
  const { isOpen } = useContext(sideBarLayout);
  let name = secureLocalStorage?.getItem('cmn_user_full_name');
  let role = secureLocalStorage.getItem('role');
  return (
    <div className="sm:flex md:flex md:gap-4 sm:gap-4 sm:items-start bg-indigo-800 px-4 py-7 border-b ">
      <img className={` max-w-fit h-auto ${!isOpen ? ' mx-auto' : null}`} src={ImageAssets.avatar} alt="" />
      <div>
        <div className={` text-white font-semibold text-md sm:mt-0 md:mt-0 mt-5  tracking-wider ${!isOpen ? 'text-center' : null}`}>
          {' '}
          {isOpen ? name : name.split(' ')[0][0].toUpperCase() + ' ' + name.split(' ')[1][0].toUpperCase()}
        </div>
        {isOpen ? (
          <div className="mt-2 text-xs font-normal text-white tracking-wider ">{role === 'SchoolAdmin' ? 'Principal' : role}</div>
        ) : null}
      </div>
    </div>
  );
};
export default AvatarSection;
