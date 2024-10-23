import React, { useEffect, useState, createContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import SideBar from '../common/SideBar/SideBar';
import Header from '../common/header/header';
import secureLocalStorage from 'react-secure-storage';
import SideBarMob from '../common/SideBarMobile/SideBarMobile';
import { useType } from '../../utils/deviceType';
import styles from './layout.module.css';
import SideNavBarComp from '../common/SideNavBar';

export const sideBarLayout = createContext();

const css = `
     * {
          overflow-y: hidden !important;
        }
`;

const Layout = () => {
  const boardDetails = secureLocalStorage?.getItem('board_details') || 0;

  const navigate = useNavigate();
  const [isOpen, SetisOpen] = useState(true);
  const [academicPeriodList, setAcademicePeriodList] = useState([]);
  const [selected_board_id, setSelectedBoardId] = useState(boardDetails[0]?.board_id);
  const [selected_board_name, setSelectedBoardName] = useState(boardDetails[0]?.board_name);
  const [selected_board_emblem, setSelectedBoardEmblem] = useState(boardDetails[0]?.board_emblem);
  const [breadCrumbName, setBreadCrumbName] = useState();
  const deviceType = useType();

  const handleOpen = () => {
    SetisOpen(!isOpen);
  };

  useEffect(() => {
    if (!secureLocalStorage.getItem('token')) {
      navigate('/');
    }
  }, []);

  return (
    secureLocalStorage.getItem('token') && (
      <>
        {isOpen && deviceType === 'mobile' ? <style>{css}</style> : null}
        <sideBarLayout.Provider
          value={{
            isOpen,
            SetisOpen,
            academicPeriodList,
            setAcademicePeriodList,
            selected_board_id,
            setSelectedBoardId,
            breadCrumbName,
            setBreadCrumbName,
            selected_board_name,
            setSelectedBoardName,
            selected_board_emblem,
            setSelectedBoardEmblem,
          }}
        >
          <div className=" sm:block md:block  flex overflow-hidden">
            {deviceType === 'mobile' ? (
              <SideBarMob isOpen={isOpen} handleOpen={handleOpen} />
            ) : (
              <SideBar isOpen={isOpen} handleOpen={handleOpen} />
            )}
            {/* <div className={`${'relative'}`}> */}
            <div
              className={`relative sm:w-full sm:h-[calc(100dvh-84px)] md:h-[calc(100dvh-84px)] w-w845 bg-primary-50 transition-all duration-200 h-screen 2xl:w-full overflow-hidden ${deviceType === 'mobile' ? '!w-full' : !isOpen ? 'w-w95 ' : null}`}
            >
              {/* Sidebar Overlay for Mobile */}
              <div
                className={`${(deviceType === 'mobile') & isOpen ? styles.sidebarwraper : ' transition-all absolute top-0 left-0 w-0 translate-x-0 h-screen overflow-hidden  '}`}
              />
              <div
                className={`${(deviceType === 'mobile') & isOpen ? styles.mobileslider : 'absolute top-0 left-0 transition-all w-0 translate-x-0 h-screen overflow-hidden '}`}
              >
                <SideNavBarComp />
              </div>
              {/* Main Body Container */}
              {/* <div className={styles.bodyContainer}> */}
              <div className=" relative overflow-y-auto h-[100dvh] sm:h-[calc(100dvh-84px)] md:h-[calc(100dvh-84px)]  px-0 pt-0 bg-primary-50 sm:!px-0 md:!px-0  sm:overflow-x-hidden">
                <Header />
                <div className="px-4 sm:px-0">
                  <Outlet />
                </div>
              </div>
            </div>
          </div>
          {/* </div> */}
        </sideBarLayout.Provider>
      </>
    )
  );
};
export default Layout;
