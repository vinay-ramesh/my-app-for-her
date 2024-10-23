import React, { memo } from 'react';
import SelectInput from '../../../common/SelectInput/SelectInput';

const SubFilters = ({ dropdownValues, selectedValues, handleDropdownValues }) => {
  return (
    <div className="grid grid-cols-5 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2  gap-4 justify-between items-center bg-white p-4 mt-4 border rounded-lg shadow-lg">
      <div>
        {console.log(dropdownValues, 'dropdownValues?.question_objective?.map')}
        <SelectInput
          options={
            dropdownValues?.assessment_subject?.map((i) => ({
              label: i?.subject,
              value: i?.subject_id,
              institutionId: i?.institution_id,
            })) || []
          }
          placeholder="All Subject"
          displayName=""
          name="assessment_subject_id"
          handleChange={(e) => {
            handleDropdownValues(e?.value || e, 'assessment_subject_id');
          }}
          value={dropdownValues?.assessment_subject
            ?.map((i) => ({ label: i?.subject, value: i.subject_id }))
            ?.filter((i) => i?.value === selectedValues?.assessment_subject_id)}
          isClearable
        />
      </div>

      <SelectInput
        options={dropdownValues?.question_sub_subject?.map((i) => ({ label: i?.sub_subject_name, value: i?.sub_subject_id })) || []}
        placeholder="Sub-subject"
        displayName=""
        name="question_sub_subject_id"
        handleChange={(e) => {
          handleDropdownValues(e?.value || e, 'question_sub_subject_id');
        }}
        value={dropdownValues?.question_sub_subject
          ?.map((i) => ({ label: i?.sub_subject_name, value: i.sub_subject_id }))
          ?.filter((i) => i?.value === selectedValues?.question_sub_subject_id)}
        isClearable
      />
      <SelectInput
        options={dropdownValues?.question_topic?.map((i) => ({ label: i?.topic_name, value: i?.topic_id })) || []}
        placeholder="Topic"
        displayName=""
        name="question_topic_id"
        handleChange={(e) => {
          handleDropdownValues(e?.value || e, 'question_topic_id');
        }}
        value={dropdownValues?.question_topic
          ?.map((i) => ({ label: i?.topic_name, value: i.topic_id }))
          ?.filter((i) => i?.value === selectedValues?.question_topic_id)}
        isClearable
      />
      <SelectInput
        options={dropdownValues?.question_sub_topic?.map((i) => ({ label: i?.sub_topic_name, value: i?.sub_topic_id })) || []}
        placeholder="Sub-Topic "
        displayName=""
        name="question_sub_topic_id"
        handleChange={(e) => {
          handleDropdownValues(e?.value || e, 'question_sub_topic_id');
        }}
        value={dropdownValues?.question_sub_topic
          ?.map((i) => ({ label: i?.sub_topic_name, value: i.sub_topic_id }))
          ?.filter((i) => i?.value === selectedValues?.question_sub_topic_id)}
        isClearable
      />

      <SelectInput
        options={dropdownValues?.question_objective?.map((i) => ({ label: i?.objective, value: i?.objective_id })) || []}
        placeholder="Objective "
        displayName=""
        name="question_objective_id"
        handleChange={(e) => {
          handleDropdownValues(e?.value || e, 'question_objective_id');
        }}
        value={dropdownValues?.question_objective
          ?.map((i) => ({ label: i?.objective, value: i.objective_id }))
          ?.filter((i) => i?.value === selectedValues?.question_objective_id)}
        isClearable
      />
    </div>
  );
};

export default memo(SubFilters);
