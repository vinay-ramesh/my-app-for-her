import React from 'react';
import ImageAssets from '../../../assets/imageAsset';

const LoginHeader = () => {
  return (
    <div className="p-4 flex justify-center items-center gap-x-1.5">
      <img src={ImageAssets.RE_Logo_1} alt="Read_Analytics_logo1" />
      <img src={ImageAssets.RE_Logo_2} alt="Read_Analytics_logo2" />
    </div>
  );
};

export default LoginHeader;
