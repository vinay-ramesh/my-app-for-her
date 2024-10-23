import https from '../config/init/https';

// RA-SC-SUMM-01:Daywise list of study circles summary by institution id
export const fetchDayWiseStudyCircleSummary = async (
  assessment_date,
  study_circle_id_list,
  dim_ra_cube_id_list,
  institution_id,
) => {
  const name = 'RA-SC-SUMM-01';
  try {
    let condition = [],
      cond = '';
    if (!assessment_date || !dim_ra_cube_id_list) {
      throw Error({ message: 'Please provide valid inputs' });
    }
    if (institution_id) {
      condition.push(`institution_id=${institution_id}`);
    }
    condition.push(`assessment_date='${assessment_date}'`);
    condition.push(`dim_ra_cube_id_list='${dim_ra_cube_id_list}'`);
    if (study_circle_id_list) {
      condition.push(`study_circle_id_list=${study_circle_id_list}`);
    } else {
      condition.push(`study_circle_id_list=0`);
    }

    if (condition.length > 0) {
      cond = `?${condition.join('&')}`;
    }
    let result = await https.get(`/named_query/${name}${cond}`);
    // console.log('result RA-SC-SUMM-01 Day wise', result);
    return result?.data?.data;
  } catch (err) {
    // console.log(err);
    throw err;
  }
};

// RA-SC-SUMM-02:Monthwise list of study circles summary by institution id
export const fetchMonthWiseStudyCircleSummary = async (
  assessment_date,
  study_circle_id_list,
  dim_ra_cube_id_list,
  institution_id,
) => {
  const name = 'RA-SC-SUMM-02';
  try {
    let condition = [],
      cond = '';
    if (!assessment_date || !dim_ra_cube_id_list) {
      throw Error({ message: 'Please provide valid inputs' });
    }
    if (institution_id) {
      condition.push(`institution_id=${institution_id}`);
    }
    condition.push(`assessment_month='${assessment_date}'`);
    condition.push(`dim_ra_cube_id_list='${dim_ra_cube_id_list}'`);
    if (study_circle_id_list) {
      condition.push(`study_circle_id_list=${study_circle_id_list}`);
    } else {
      condition.push(`study_circle_id_list=0`);
    }

    if (condition.length > 0) {
      cond = `?${condition.join('&')}`;
    }
    let result = await https.get(`/named_query/${name}${cond}`);
    // console.log('result RA-SC-SUMM-02 Month wise', result);
    return result?.data?.data;
  } catch (err) {
    // console.log(err);
    throw err;
  }
};

// RA-SC-SUMM-03:AcademicPeriodwise list of study circles summary by institution id
export const fetchYearWiseStudyCircleSummary = async (
  academic_period_id,
  study_circle_id_list,
  dim_ra_cube_id_list,
  institution_id,
) => {
  const name = 'RA-SC-SUMM-03';
  try {
    let condition = [],
      cond = '';
    if (!academic_period_id || !dim_ra_cube_id_list) {
      throw Error({ message: 'Please provide valid inputs' });
    }
    if (institution_id) {
      condition.push(`institution_id=${institution_id}`);
    }
    condition.push(`academic_period_id=${academic_period_id}`);
    condition.push(`dim_ra_cube_id_list='${dim_ra_cube_id_list}'`);
    if (study_circle_id_list) {
      condition.push(`study_circle_id_list=${study_circle_id_list}`);
    } else {
      condition.push(`study_circle_id_list=0`);
    }

    if (condition.length > 0) {
      cond = `?${condition.join('&')}`;
    }
    let result = await https.get(`/named_query/${name}${cond}`);
    // console.log('result RA-SC-SUMM-03 Year wise', result);
    return result?.data?.data;
  } catch (err) {
    // console.log(err);
    throw err;
  }
};
