import React, { useEffect, useState, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import toast from 'react-hot-toast';
import ImageAssets from '../../../assets/imageAsset';
import { fetchAcademicPeriodList } from '../../../api/academicPeriod';
import { sideBarLayout } from '../../layout/layout';
import BoardInfo from '../BoardInfo/BoardInfo';
import BoardInfoSelect from '../BoardInfoSelect/BoardInfoSelect';
import { Link } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const overlayClick = useRef(null);

  const boardDetails = secureLocalStorage.getItem('board_details');
  const academicPeriodContext = useContext(sideBarLayout);
  // console.log('academicPeriodContext', academicPeriodContext);

  useEffect(() => {
    const fetchAcademicList = async () => {
      try {
        const academicPeriodList = await fetchAcademicPeriodList(academicPeriodContext.selected_board_id);
        console.log('academicPeriodList from header', academicPeriodList);
        academicPeriodContext.setAcademicePeriodList(academicPeriodList);
      } catch (err) {
        console.log('Error in fetching academic periods for selected board');
        toast.error('Error in fetching academic periods for selected board');
      }
    };
    fetchAcademicList();
  }, [academicPeriodContext.selected_board_id]);

  const handleDropdownChange = async (board) => {
    academicPeriodContext.setSelectedBoardId(board.board_id);
    academicPeriodContext.setSelectedBoardName(board.board_name);
    academicPeriodContext.setSelectedBoardEmblem(board?.board_emblem);
    setShowDropdown(false);
  };

  const toggleModalOpenClose = () => {
    setShowDropdown(!showDropdown);
  };

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (overlayClick.current && !overlayClick.current.contains(event.target)) {
        toggleModalOpenClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleModalOpenClose]);

  return (
    <>
      <header className="sticky top-0 z-10 bg-primary-50 pt-4 px-4">
        <div className="flex py-2 sm:flex-col-reverse md:flex-col-reverse justify-between mb-4 px-4 items-center bg-white  rounded-lg shadow-lg border">
          <div className="flex items-center gap-3 ">
            <Link
              to={'/' + location?.pathname?.split('/')?.[1]}
              className="tracking-wide font-medium capitalize text-sm md:text-md lg:text-md xl:text-md 2xl:text-md"
            >
              {location?.pathname?.split('/')?.[1] === 'studycircle' ? 'Study Circle' : location?.pathname?.split('/')?.[1]}{' '}
            </Link>
            {location?.pathname?.split('/')?.length > 2 ? (
              <div>
                <span className=" text-gray-500 text-xl font-semibold capitalize">{'>'}</span>{' '}
                <span className=" text-gray-500  pl-2 capitalize tracking-wide text-sm md:text-md lg:text-md xl:text-md 2xl:text-md">
                  {academicPeriodContext?.breadCrumbName}
                </span>
              </div>
            ) : null}
          </div>
          <div className="hidden sm:block sm:border-t w-full"></div>
          <div className="flex items-center gap-4 mb-2">
            {boardDetails?.length == 1 ? (
              <BoardInfo boardDetails={boardDetails} />
            ) : (
              <BoardInfoSelect
                boardDetails={boardDetails}
                academicPeriodContext={academicPeriodContext}
                showDropdown={showDropdown}
                overlayClick={overlayClick}
                handleDropdownChange={handleDropdownChange}
                toggleModalOpenClose={toggleModalOpenClose}
              />
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
