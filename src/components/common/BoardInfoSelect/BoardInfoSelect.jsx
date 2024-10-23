import React from 'react';
import secureLocalStorage from 'react-secure-storage';
import ImageAssets from '../../../assets/imageAsset';

const BoardInfoSelect = (props) => {
  const { academicPeriodContext, showDropdown, overlayClick, boardDetails, handleDropdownChange, toggleModalOpenClose } = props;

  return (
    <>
      <div className=" flex items-center relative">
        <div>
          <h3 className="text-end text-sm md:text-md lg:text-md xl:text-md 2xl:text-md">{`${secureLocalStorage?.getItem('schoolName') || 'NA'}, ${secureLocalStorage?.getItem('schoolLocation') || 'NA'}`}</h3>
          <h4 className="text-end text-sm md:text-md lg:text-md xl:text-md 2xl:text-md">
            {academicPeriodContext.selected_board_name}
          </h4>
        </div>
        <div className="flex justify-between" onClick={toggleModalOpenClose}>
          <img
            src={academicPeriodContext.selected_board_emblem || secureLocalStorage.getItem('schoolEmblem')}
            alt="school-emblem"
            className="h-20 w-20 sm:h-12 sm:w-12 md:h-15 lg:h-18 object-cover cursor-pointer mx-2 md:h-15 lg:h-18"
          />
          <img src={ImageAssets.dropdownArrowDown} alt="dropdown" className="h-auto  w-auto cursor-pointer" />
        </div>
        {showDropdown ? (
          <div
            className="absolute top-0 bg-white right-0 border p-2 rounded-lg drop-shadow-lg h-fit max-h-[50dvh] overflow-y-auto w-full max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl text-sm md:text-md lg:text-md xl:text-md 2xl:text-md"
            ref={overlayClick}
          >
            <ul>
              {boardDetails?.map((ele) => (
                <li
                  key={ele.board_id}
                  className="flex justify-end border-b cursor-pointer hover:bg-primary-50 last:border-0 "
                  onClick={() => handleDropdownChange(ele)}
                >
                  <div className="flex flex-col justify-evenly">
                    <h4 className="text-end text-sm md:text-md lg:text-md xl:text-md 2xl:text-md">{ele.board_name}</h4>
                  </div>
                  <img
                    src={ele?.board_emblem || secureLocalStorage.getItem('schoolEmblem')}
                    className="h-20 w-20 object-cover cursor-pointer sm:h-12 sm:w-12 md:h-15 lg:h-18"
                    alt="board-emblem"
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default BoardInfoSelect;
