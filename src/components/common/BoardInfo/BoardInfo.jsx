import React from 'react';
import secureLocalStorage from 'react-secure-storage';

const BoardInfo = (props) => {
  const { boardDetails } = props;

  return (
    <>
      <div>
        <h3 className="text-end">{`${secureLocalStorage?.getItem('schoolName') || 'NA'}, ${secureLocalStorage?.getItem('schoolLocation') || 'NA'}`}</h3>
        <h4 className="text-end text-sm md:text-md lg:text-md xl:text-md 2xl:text-md">{boardDetails[0]?.board_name}</h4>
      </div>
      <img
        src={boardDetails[0]?.board_emblem ? boardDetails[0]?.board_emblem : secureLocalStorage.getItem('schoolEmblem')}
        alt="school-emblem"
        className="h-20 sm:h-12 sm:w-12 w-auto cursor-pointer"
      />
    </>
  );
};

export default BoardInfo;
