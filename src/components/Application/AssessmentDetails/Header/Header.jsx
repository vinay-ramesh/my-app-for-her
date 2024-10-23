import React from 'react';
import moment from 'moment';
import ImageAssets from '../../../../assets/imageAsset';

const Header = ({ data, navigateButton, index, maxIndex }) => {
  console.log(data, 'qwer');
  return (
    <section className="bg-white flex border items-center rounded-lg drop-shadow-lg p-4 justify-between mb-4 ">
      <div className="flex gap-3">
        <button
          type="button "
          className={`${index === 0 ? ' cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={() => {
            navigateButton(data?.[0]?.assessment_id, 'previous');
          }}
          disabled={index === 0}
        >
          <img className=" rotate-180 w-5 " src={ImageAssets?.Arrow_Right} alt="" />
        </button>
        <h3 className=" whitespace-nowrap text-sm">S# {data?.session_code}</h3>
        <button
          type="button "
          className={`${index === maxIndex ? ' cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={() => {
            navigateButton(data?.[0]?.assessment_id, 'next');
          }}
          disabled={index === maxIndex}
        >
          <img src={ImageAssets?.Arrow_Right} alt="" className="w-5 " />
        </button>
      </div>
      <div className=" text-sm">
        {moment(data?.assessment_date?.value || new Date()).format('ddd')},{' '}
        {moment(data?.assessment_date?.value || new Date()).format('DD MMM YYYY')}
      </div>
    </section>
  );
};
export default Header;
