import https from '../config/init/https';

// RA-STUD-DTL-01: Daywise fetch Student Details

export const getAllPerformance = async (date, student_id, study_circle_id, dim_ra_cube_id) => {
  const name = 'RA-STUD-DTL-01';
  const response = await https.get(
    `/named_query/${name}?assessment_date='${date}'&student_id=${student_id}&study_circle_id=${study_circle_id}&dim_ra_cube_id='${dim_ra_cube_id}'`,
  );
  return response;
};

//RA-STUD-DTL-02: Monthwise fetch Student Details
export const getMonthAllPerformance = async (date, student_id, study_circle_id, dim_ra_cube_id) => {
  const name = 'RA-STUD-DTL-02';
  const response = await https.get(
    `/named_query/${name}?assessment_month='${date}'&student_id=${student_id}&study_circle_id=${study_circle_id}&dim_ra_cube_id='${dim_ra_cube_id}'`,
  );
  return response;
};

//RA-STUD-DTL-03: Periodwise fetch Student Details
export const getYearAllPerformance = async (date, student_id, study_circle_id, dim_ra_cube_id) => {
  const name = 'RA-STUD-DTL-03';
  const response = await https.get(
    `/named_query/${name}?academic_period_id=${date}&student_id=${student_id}&study_circle_id=${study_circle_id}&dim_ra_cube_id='${dim_ra_cube_id}'`,
  );
  return response;
};

//RA-STUD-SUBJ-DTL-01: Daywise fetch Student Subject Details
export const getStudentTrend = async (date, student_id, study_circle_id, dim_ra_cube_id) => {
  const name = 'RA-STUD-SUBJ-DTL-01';
  const response = await https.get(
    `/named_query/${name}?assessment_date='${date}'&student_id=${student_id}&study_circle_id=${study_circle_id}&dim_ra_cube_id_list='${dim_ra_cube_id}'`,
  );
  return response;
};

//RA-STUD-SUBJ-DTL-02: Monthwise fetch Student Subject Details
export const getMonthStudentTrend = async (date, student_id, study_circle_id, dim_ra_cube_id) => {
  const name = 'RA-STUD-SUBJ-DTL-02';
  const response = await https.get(
    `/named_query/${name}?assessment_month='${date}'&student_id=${student_id}&study_circle_id=${study_circle_id}&dim_ra_cube_id_list='${dim_ra_cube_id}'`,
  );
  return response;
};

//RA-STUD-SUBJ-DTL-03: Assessment Periodwise fetch Student Subject Details
export const getYearStudentTrend = async (date, student_id, study_circle_id, dim_ra_cube_id) => {
  const name = 'RA-STUD-SUBJ-DTL-03';

  const response = await https.get(
    `/named_query/${name}?academic_period_id=${date}&student_id=${student_id}&study_circle_id=${study_circle_id}&dim_ra_cube_id_list='${dim_ra_cube_id}'`,
  );
  return response;
};
