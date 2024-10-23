import React, { useState, useEffect } from 'react';
import ImageAssets from '../../../../../assets/imageAsset';

const StudentList = ({ studentList }) => {
  console.log(studentList, 'studentList');
  const [activeButton, setActiveButton] = useState(0);

  useEffect(() => {
    studentList?.sort((a, b) => a?.student_id - b?.student_id);
  }, []);
  const sortFunc = (e) => {
    studentList?.sort((a, b) => a?.[e] - b?.[e]);
  };

  return (
    <section className="">
      <section className="bg-white rounded-lg  drop-shadow-lg border mb-4 sticky top-0 z-[1] ">
        <div className=" bg-primary-500 text-center text-white py-1">Student List</div>
        <div className="flex justify-between py-1 mx-4">
          {' '}
          <div
            className={`${activeButton === 0 ? 'text-orange-500' : null} cursor-pointer`}
            onClick={() => {
              setActiveButton(0);
              sortFunc('student_id');
            }}
          >
            RA#{' '}
          </div>
          <div
            className={`${activeButton === 1 ? 'text-orange-500' : null} cursor-pointer`}
            onClick={() => {
              setActiveButton(1);
              sortFunc('student_name');
            }}
          >
            Name
          </div>
          <div
            className={`${activeButton === 2 ? 'text-orange-500' : null} cursor-pointer`}
            onClick={() => {
              setActiveButton(2);
              sortFunc('response_velocity');
            }}
          >
            Session
          </div>
          <div
            className={`${activeButton === 3 ? 'text-orange-500' : null} cursor-pointer`}
            onClick={() => {
              setActiveButton(3);
              sortFunc('response_topic_velocity');
            }}
          >
            Topic
          </div>
        </div>
      </section>
      <section>
        {studentList?.map((i, index) => (
          <div className=" bg-white rounded-lg mb-3 border drop-shadow-lg" key={index}>
            <div className="px-3 py-4  flex  gap-3 ">
              <div className=" flex-shrink ">
                <img src={ImageAssets?.avatar} alt="" className="w-15` h-15 rounded-full border mb-2" />
                <img src={ImageAssets?.Hand_Raise_icon} alt="" className="w-6 h-6  mx-auto rounded-full" />
              </div>
              <div className="flex-grow mt-[4%] ">
                <p className=" text-gray-500">R# {i?.student_id || '--'}</p>
                <p>{i?.student_name || '--'}</p>
                <div className="flex gap-x-2 flex-wrap">
                  {i?.question_wise_results?.map((j, ind) => (
                    <div
                      key={ind}
                      className={`w-5 h-5 ${j?.result === 'correct' ? 'bg-green-500' : j?.result === 'incorrect' ? 'bg-red-600' : j?.result === 'not_answered' ? 'bg-gray-500' : j.result === 'absent' ? 'bg-red-200' : 'bg-[#1C64F2]'}  rounded-sm mb-2`}
                    ></div>
                  ))}
                </div>
                <div className=" flex justify-between items-center p-2 rounded-lg w-full bg-primary-50">
                  <img src={ImageAssets?.Speedometer_Icon} alt="" className="w-6 h-6" />
                  <p>
                    <span className="text-gray-500">Session</span> {(i?.response_velocity * 5)?.toFixed(2)}
                  </p>
                  <p>
                    <span className="text-gray-500">Topic</span> {i?.response_topic_velocity}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </section>
  );
};
export default StudentList;
