import https from '../config/init/https';

// RA-ASMT-DTL-01:Assessment Detail Header Section

export const assessmentDetailHeaderSection = async (assessment_id, study_circle_id, academic_period_id) => {
  const name = 'RA-ASMT-DTL-01';
  const response = await https.get(
    `/named_query/${name}?assessment_id='${assessment_id}'&study_circle_id=${study_circle_id}&academic_period_id=${academic_period_id}`,
  );
  return response?.data?.data || [];
};

//RA-ASMT-DTL-02:Assessment Questions Section - Pie charts
export const assessmentQuestionsSectionPieChart = async (assessment_id, study_circle_id) => {
  const name = 'RA-ASMT-DTL-02';
  const response = await https.get(`/named_query/${name}?assessment_id='${assessment_id}'&study_circle_id=${study_circle_id}`);
  return response?.data?.data;
};

//RA-ASMT-DTL-03:Assessment Questions Section - Question Details and Answer graph
export const assessmentQuestionDetails = async (assessment_id, study_circle_id, question_id) => {
  const name = 'RA-ASMT-DTL-03';
  const response = await https.get(
    `/named_query/${name}?assessment_id='${assessment_id}'&study_circle_id=${study_circle_id}&question_id=${question_id}`,
  );
  return response?.data?.data;
};

//RA-ASMT-DTL-04:Assessment Questions Section - Response Details
export const assessmentQuestionsSectionResponseDetails = async (assessment_id, study_circle_id, question_id) => {
  const name = 'RA-ASMT-DTL-04';
  const response = await https.get(
    `/named_query/${name}?assessment_id='${assessment_id}'&study_circle_id=${study_circle_id}&question_id=${question_id}`,
  );
  return response?.data?.data;
};

//RA-ASMT-DTL-05:Assessment Student wise section - Response Details
export const assessmentStudentWiseSection = async (assessment_id, study_circle_id) => {
  const name = 'RA-ASMT-DTL-05';
  const response = await https.get(`/named_query/${name}?assessment_id='${assessment_id}'&study_circle_id=${study_circle_id}`);
  return response?.data?.data;
};
