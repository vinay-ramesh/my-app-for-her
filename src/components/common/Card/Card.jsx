import React, { Children } from 'react';

const Card = ({ Children }) => {
  return <div className="bg-white flex border rounded-lg drop-shadow-lg p-4 justify-between mb-4 ">{Children}</div>;
};
export default Card;
