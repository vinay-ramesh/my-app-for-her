import React from 'react';
import { calculatePercentage } from '../../screen/StudentDetails/CommonFunction/CommonFunction';

const ProgressChart = ({ values }) => {
  let totalQuestions =
    values?.count_correct_responses +
      values?.count_near_correct_responses +
      values?.count_incorrect_responses +
      values?.count_not_answered_responses || 0;
  return (
    <div>
      <div className=" relative h-2.5 bg-gray-200 w-full rounded-full ">
        <div
          className={` absolute z-[2]  left-0 h-2.5 bg-green-400 rounded-full transition-all  duration-t2000 ease-linear  `}
          style={{
            width: `${calculatePercentage(values?.count_correct_responses, totalQuestions)}%`,
          }}
        ></div>
        <div
          className={` absolute left-0 z-[1] h-2.5 bg-primary-500 w-[${calculatePercentage(values.nearCorrect)}%] rounded-full`}
          style={{
            width: `${calculatePercentage(values?.count_near_correct_responses, totalQuestions) + calculatePercentage(values?.count_correct_responses, totalQuestions)}%`,
          }}
        ></div>
        <div
          className={` absolute h-2.5 z-0 bg-red-500 w-['${calculatePercentage(values.inCorrect) + calculatePercentage(values.nearCorrect) + calculatePercentage(values.correct)}%'] rounded-full `}
          style={{
            width: `${calculatePercentage(values?.count_near_correct_responses, totalQuestions) + calculatePercentage(values?.count_correct_responses, totalQuestions) + calculatePercentage(values?.count_incorrect_responses, totalQuestions)}%`,
          }}
        ></div>
      </div>
      <div className=" flex justify-between flex-wrap mt-6">
        <div>
          <div className="text-sm font-medium text-gray-900">{totalQuestions}</div>
          <div className="text-sm font-mediums text-gray-900 sm:text-xs ">Questions</div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">{values?.count_correct_responses || 0}</div>
          <div className="text-sm font-mediums text-green-400 capitalize sm:text-xs ">correct</div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">{values?.count_near_correct_responses || 0}</div>
          <div className="text-sm font-mediums text-primary-500 capitalize sm:text-xs">near correct</div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">{values?.count_incorrect_responses || 0}</div>
          <div className="text-sm font-mediums text-red-500 capitalize sm:text-xs ">incorrect</div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">{values?.count_not_answered_responses || 0}</div>
          <div className="text-sm font-mediums text-gray-400 sm:text-xs">Not Answered</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;
