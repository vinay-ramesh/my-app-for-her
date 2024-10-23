import React from 'react';
import ImageAssets from '../../../../assets/imageAsset';
import { Link, useNavigate } from 'react-router-dom';

const SessionDetails = ({ data, selectedAssesment }) => {
  const navigate = useNavigate();
  const constReadvelocity = process.env.VITE_CONSTANT_READ_VELOCITY_MAX;
  console.log(data, 'session details');
  const handleNavigate = () => {
    const filterValues = {
      assessment_mode_id: data?.assessment_mode_id || null,
      assessment_organizer_id: data?.assessment_organizer_id || null,
      assessment_subject_id: data?.subject_id || null,
      assessment_type_id: data?.assessment_type_id || null,
      question_objective_id: data?.question_objective_id || null,
      question_sub_subject_id: data?.sub_subject_id || null,
      question_sub_topic_id: data?.question_sub_topic_id || null,
      question_topic_id: data?.question_sub_topic_id || null,
    };
    console.log(filterValues, 'filterValues');
    localStorage.setItem('studyCircleFilterVal', JSON.stringify(filterValues));
    localStorage.setItem('datemode', 'D');
    localStorage.setItem('selectedDate', data?.assessment_date?.value);

    navigate(`/studycircle/studycircledetails/${selectedAssesment?.[0]?.study_circle_id}?redirected=true`, {
      state: {
        study_circle_name: data?.study_circle_name,
      },
    });
  };
  return (
    <section className=" bg-white rounded-lg drop-shadow-lg mb-4 ">
      <div className="flex flex-wrap justify-between p-4 border-b">
        <div>
          <div>{data?.topic_name}</div>
          <div className=" text-xs underline cursor-pointer" onClick={handleNavigate} target="_blank">
            View Topic Performance
          </div>
        </div>
        <div className="flex gap-4 sm:gap-2 sm:justify-between items-center">
          <div className="  pr-3   border-gray-400 sm:border-r-0  sm:pb-2 md:pb-2 ">
            <img src={ImageAssets.Speedometer_Icon} alt="Speedometer_Icon" className=" mx-auto  w-11 h-11 sm:w-8" />
            <p className=" text-center text-sm font-semibold text-gray-600 whitespace-nowrap sm:text-xs">Read Velocity</p>
          </div>

          <div className="text-green-500 sm:text-xs border font-semibold tracking-wide border-green-300 text-center p-2 rounded-lg bg-green-100 ">
            <p>{((data?.avg_velocity || 0) * constReadvelocity).toFixed(2)}</p>
            <p className=" text-black sm:text-xs font-normal">Session</p>
          </div>
          <div className="text-green-500 sm:text-xs border font-semibold tracking-wide border-green-300 text-center py-2 px-4 rounded-lg bg-green-100 ">
            <p>{((data?.avg_topic_velocity || 0) * constReadvelocity).toFixed(2)}</p>
            <p className=" text-black font-normal sm:text-xs">Topic</p>
          </div>
        </div>
      </div>
      {data?.arr_session_codes?.length > 0 ? (
        <div className="p-4 flex flex-wrap  gap-2">
          {data?.arr_session_codes?.map((i) => (
            <Link
              // to={{ pathname: `/assessments/assessmentdetails/${selectedAssesment?.[0]?.assessment_id}`, state: { foo: 'bar' } }}
              to={`/assessments/assessmentdetails/${i?.assessment_id}?sc=${selectedAssesment?.[0]?.study_circle_id}&academic_period_id=${selectedAssesment?.[0]?.academic_period_id}`}
              target="_blank"
              className={`border cursor-pointer px-4 hover:border-primary-500 py-2 border-gray-200 text-gray-900 text-xs font-medium rounded-lg ${data?.session_code === i?.group_session_code ? 'bg-primary-800 text-white  pointer-events-none !cursor-not-allowed ' : null} `}
            >
              S# {i?.group_session_code}
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default SessionDetails;
