import React, { memo } from 'react';
import ImageAssets from '../../../../assets/imageAsset';
import SelectInput from '../../../common/SelectInput/SelectInput';
import Badge from '../../../common/Badge/Badge';

const StudentProfile = ({ studentDetails, dropdownValues, selectedValues, handleDropdownValues }) => {
  return (
    <div className="flex w-full  items-center bg-white p-4 gap-8 border rounded-lg shadow-lg flex-shrink-0 flex-wrap sm:flex-col md:flex-col ">
      <div className="flex sm:justify-between md:justify-between sm:flex-grow sm:w-full items-center space-x-4 flex-shrink-0 lg:justify-between md:w-full">
        <img src={studentDetails?.student_profile_pic_url || ImageAssets.avatar} alt="Profile" className="w-20 h-20 rounded-full" />
        <div>
          <h1 className="text-2xl font-medium">{studentDetails?.studentName}</h1>
          <div className="text-gray-500 flex gap-4">
            <Badge name={`R# ${studentDetails?.studentId || '--'}`} />
            <Badge name={studentDetails?.studyCircleName || '--'} />
          </div>
        </div>
      </div>
      <div className="flex  gap-2 xl:w-max sm:w-full md:w-full flex-grow flex-wrap flex-shrink-0">
        <div className=" flex-shrink-0 min-w-[200px] sm:min-w-full">
          <SelectInput
            options={dropdownValues?.assessment_mode?.map((i) => ({ label: i?.name, value: i?.assessment_mode_id })) || []}
            placeholder="All Mode"
            displayName=""
            name="assessment_mode_id"
            handleChange={(e) => {
              handleDropdownValues(e?.value || e, 'assessment_mode_id');
            }}
            value={dropdownValues?.assessment_mode
              ?.map((i) => ({ label: i?.name, value: i.assessment_mode_id }))
              ?.filter((i) => i?.value === selectedValues?.assessment_mode_id)}
            isClearable
          />
        </div>
        <div className=" flex-shrink-0 sm:min-w-full min-w-[200px] ">
          <SelectInput
            options={dropdownValues?.assessment_type?.map((i) => ({ label: i?.name, value: i?.assessment_type_id })) || []}
            placeholder="Type"
            displayName=""
            name="assessment_type_id"
            handleChange={(e) => {
              handleDropdownValues(e?.value || e, 'assessment_type_id');
            }}
            value={dropdownValues?.assessment_type
              ?.map((i) => ({ label: i?.name, value: i.assessment_type_id }))
              ?.filter((i) => i?.value === selectedValues?.assessment_type_id)}
            isClearable
          />
        </div>
        <div className=" flex-shrink-0 min-w-[200px] sm:min-w-full">
          <SelectInput
            options={dropdownValues?.assessment_organizer?.map((i) => ({ label: i?.name, value: i?.organiser_type_id })) || []}
            placeholder="Organiser"
            displayName=""
            name="assessment_organizer_id"
            handleChange={(e) => {
              handleDropdownValues(e?.value || e, 'assessment_organizer_id');
            }}
            value={dropdownValues?.assessment_organizer
              ?.map((i) => ({ label: i?.name, value: i.organiser_type_id }))
              ?.filter((i) => i?.value === selectedValues?.assessment_organizer_id)}
            isClearable
          />
        </div>
      </div>

      <div className="hidden text-gray-500  flex-col gap-4 text-left self-start invisible">
        <div className=" text-sm px-2 py-1 rounded-lg bg-gray-100 w-fit  border border-gray-200">
          Hindi language score low at Grammar
        </div>
        <div className=" text-sm px-2 py-1 rounded-lg bg-gray-100 w-fit  border border-gray-200">Attendance is below 75% </div>
      </div>
    </div>
  );
};

export default memo(StudentProfile);
