import React from 'react';

const SubmitButton = (props) => {
  const { handleSubmit } = props;
  return (
    <button
      className="h-11 rounded-lg bg-orange-400 outline-none border-none text-white cursor-pointer text-lg  2xl:text-xl 2xl:h-15"
      onClick={handleSubmit}
    >
      Submit
    </button>
  );
};

export default SubmitButton;
