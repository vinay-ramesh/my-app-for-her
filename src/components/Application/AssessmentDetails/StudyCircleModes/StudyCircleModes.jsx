import React from 'react';
import ImageAssets from '../../../../assets/imageAsset';
import moment from 'moment';

const StudyCircleModes = ({ data }) => {
  const names = [
    {
      id: data?.assessment_organizer_id,
      label: 'Organiser',
      value: data?.assessment_organizer_name,
      img: ImageAssets?.Organization_Icon,
      border: true,
    },
    {
      id: data?.assessment_type_id,
      label: 'Type',
      value: data?.assessment_type_name,
      img: ImageAssets?.Type_Icon,
      border: true,
    },
    {
      id: data?.assessment_mode_id,
      label: 'Mode',
      value: data?.assessment_mode_name,
      img: ImageAssets?.Mode_Icon,
      border: true,
    },
    {
      id: data?.study_circle_id,
      label: 'Study Circle',
      value: data?.study_circle_name,
    },
    {
      id: data?.sub_subject_id,
      label: 'Subject',
      value: data?.sub_subject_name,
    },
    {
      id: data?.sub_subject_id,
      label: 'Sub-Subject',
      value: data?.sub_subject_name,
    },
    // {
    //   id: data?.educator_id,
    //   label: 'Educator',
    //   value: data?.educator_name,
    // },
    {
      id: data?.start_time,
      label: 'Time',
      value: `${data?.start_time?.value && data?.end_time?.value ? `${moment(data?.start_time?.value, 'h:mm:ss A').format('h:mm A')} - ${moment(data?.end_time?.value, 'h:mm:ss A').format('h:mm A')}` : '00:00 - 00:00'}`,
    },
    {
      id: data?.count_hand_raises,
      label: '',
      value: data?.count_hand_raises,
      img: ImageAssets?.Hand_Raise_icon,
    },
  ];
  return (
    <section className="flex flex-wrap items-center bg-white rounded-lg sm:items-stretch justify-between drop-shadow-lg p-4 gap-2 mb-4">
      {names?.map((i, ind) => (
        <div
          className={`flex gap-3 sm:flex-col items-center px-3 py-1 
          ${i?.border ? 'rounded-lg border border-gray-200 bg-gray-50' : ''} 
          ${i?.border || names.length - 1 ? 'sm:w-[20%]' : ' sm:w-[30%]'} `}
          key={ind}
        >
          {i.img && <img src={i.img} alt="" className="w-6 h-6" />} {/* Ensure image sizing */}
          <div className="text-center sm:text-left">
            {' '}
            {/* Center text on mobile */}
            <h2 className="text-sm font-semibold text-gray-500 sm:text-xs">{i.label}</h2>
            <div className="text-md font-medium sm:text-xs">{i.value === 0 ? i.value : i?.value || '--'}</div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default StudyCircleModes;
