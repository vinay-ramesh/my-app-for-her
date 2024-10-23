import React from 'react';
import ImageAssets from '../../../assets/imageAsset';

const InputField = (props) => {
  const { type, errorMessage, placeholder, handleChange, value, error, name, showPassword, handleToggle } = props;

  return (
    <div>
      {showPassword ? (
        <div className="flex">
          <input
            placeholder={placeholder}
            className="border border-gray-300 bg-gray-50 text-sm rounded-lg p-2  2xl:text-md font-sans font-normal text-gray-500 focus:outline-none  w-full"
            type={type}
            value={value}
            name={name}
            onChange={handleChange}
          />
          <span class="flex justify-around items-center" onClick={handleToggle}>
            <img src={ImageAssets.Eye_Outline} className="absolute mr-10" />
          </span>
        </div>
      ) : (
        <input
          placeholder={placeholder}
          className="border w-full text-sm border-gray-300 bg-gray-50 rounded-lg p-2  2xl:text-md font-sans font-normal text-gray-500 focus:outline-none "
          type={type}
          value={value}
          name={name}
          onChange={handleChange}
        />
      )}
      {error ? (
        <div className="sm:text-xs  font-sans font-normal text-orange-500 w-fit h-fit text-xs 2xl:text-sm tracking-wider">
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
};

export default InputField;
