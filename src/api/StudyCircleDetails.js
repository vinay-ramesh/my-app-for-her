import https from '../config/init/https';

// RA-SC-DTL-01:Daywise  details of Study Circle
export const getAllTrendDetails = async (date, study_circle_id, dim_ra_cube_id) => {
  const name = 'RA-SC-DTL-01';
  const response = await https.get(
    `/named_query/${name}?study_circle_id=${study_circle_id}&assessment_date='${date}'&dim_ra_cube_id='${dim_ra_cube_id}'`,
  );
  return response;
};

//RA-SC-DTL-02:Monthwise detail of study circle
export const getMonthAllTrendDetails = async (date, study_circle_id, dim_ra_cube_id) => {
  const name = 'RA-SC-DTL-02';
  const response = await https.get(
    `/named_query/${name}?study_circle_id=${study_circle_id}&assessment_month='${date}'&dim_ra_cube_id='${dim_ra_cube_id}'`,
  );
  return response;
};

//RA-SC-DTL-03:AcademicPeriodwise Detail of Study circle
export const getYearAllTrendDetails = async (date, study_circle_id, dim_ra_cube_id) => {
  const name = 'RA-SC-DTL-03';
  const response = await https.get(
    `/named_query/${name}?academic_period_id=${date}&study_circle_id=${study_circle_id}&dim_ra_cube_id='${dim_ra_cube_id}'`,
  );
  return response;
};

//RA-SC-SUBJ-DTL-01:Daywise: Subject avg velocity details with history
export const getStudyCircleVelocity = async (date, study_circle_id, dim_ra_cube_id) => {
  const name = 'RA-SC-SUBJ-DTL-01';
  const response = await https.get(
    `/named_query/${name}?assessment_date='${date}'&study_circle_id=${study_circle_id}&dim_ra_cube_id_list='${dim_ra_cube_id}'`,
  );
  return response;
};

//RA-SC-SUBJ-DTL-02: Monthwise : Subject avg velocity details history
export const getMonthStudyCircleVelocity = async (date, study_circle_id, dim_ra_cube_id) => {
  const name = 'RA-SC-SUBJ-DTL-02';
  const response = await https.get(
    `/named_query/${name}?assessment_month='${date}'&study_circle_id=${study_circle_id}&dim_ra_cube_id_list='${dim_ra_cube_id}'`,
  );
  return response;
};

//RA-SC-SUBJ-DTL-03: AcademicPeriodwise - Subject avg velocity details with history
export const getYearStudyCircleVelocity = async (date, study_circle_id, dim_ra_cube_id) => {
  const name = 'RA-SC-SUBJ-DTL-03';

  const response = await https.get(
    `/named_query/${name}?academic_period_id=${date}&study_circle_id=${study_circle_id}&dim_ra_cube_id_list='${dim_ra_cube_id}'`,
  );
  return response;
};
