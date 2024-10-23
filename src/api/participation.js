import https from '../config/init/https';

// RA-SC-PART-SUMM-01:Daywise list of study circles level participation summary
export const fetchDayWiseParticipationSummary = async (
  institution_id,
  assessment_date,
  study_circle_id_list,
  dim_ra_cube_id_list,
) => {
  const name = 'RA-SC-PART-SUMM-01';
  try {
    let condition = [],
      cond = '';
    condition.push(`institution_id=${institution_id}`);
    if (!assessment_date || !dim_ra_cube_id_list) {
      throw Error({ message: 'Please provide valid inputs' });
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
    // console.log('result RA-SC-PART-SUMM-02 Month wise', result);
    return result?.data?.data;
  } catch (err) {
    // console.log(err);
    throw err;
  }
};

// RA-SC-PART-SUMM-02:Monthwise list of study circles level participation summary
export const fetchMonthWiseParticipationSummary = async (
  institution_id,
  assessment_month,
  study_circle_id_list,
  dim_ra_cube_id_list,
) => {
  const name = 'RA-SC-PART-SUMM-02';
  try {
    let condition = [],
      cond = '';
    condition.push(`institution_id=${institution_id}`);
    if (!assessment_month || !dim_ra_cube_id_list) {
      throw Error({ message: 'Please provide valid inputs' });
    }
    condition.push(`assessment_month='${assessment_month}'`);
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
    // console.log('result RA-SC-PART-SUMM-02 Day wise', result);
    return result?.data?.data;
  } catch (err) {
    // console.log(err);
    throw err;
  }
};

// RA-SC-PART-SUMM-03:AcademicPeriodwise list of study circles level participation summary
export const fetchYearWiseParticipationSummary = async (
  institution_id,
  academic_period_id,
  study_circle_id_list,
  dim_ra_cube_id_list,
) => {
  const name = 'RA-SC-PART-SUMM-03';
  try {
    let condition = [],
      cond = '';
    condition.push(`institution_id=${institution_id}`);
    if (!academic_period_id || !dim_ra_cube_id_list) {
      throw Error({ message: 'Please provide valid inputs' });
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
    // console.log('result RA-SC-PART-SUMM-03 Year wise', result);
    return result?.data?.data;
  } catch (err) {
    // console.log(err);
    throw err;
  }
};
