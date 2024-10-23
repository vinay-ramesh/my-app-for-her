import React from 'react';
import AvatarSection from './AvatarSection';
import MenuItem from './MenuItemsSection';
import SideBarFooter from './SideBarFooter';

const SideNavBarComp = () => {
  return (
    <div>
      <div>
        <AvatarSection />
        <MenuItem />
      </div>
      <div className=" ">
        <SideBarFooter />
      </div>
    </div>
  );
};
export default SideNavBarComp;
