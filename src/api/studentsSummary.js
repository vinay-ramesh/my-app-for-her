import https from '../config/init/https';

// RA-STUD-SUMM-01:Daywise Fetch list of students
export const fetchDayWiseStudentSummary = async (assessment_date, study_circle_list, dim_ra_cube_id, limit, offset) => {
  const name = 'RA-STUD-SUMM-01';
  try {
    let condition = [],
      cond = '';
    if (!assessment_date || !dim_ra_cube_id) {
      throw Error({ message: 'Please provide valid inputs' });
    }
    condition.push(`assessment_date='${assessment_date}'`);
    if (study_circle_list) {
      condition.push(`study_circle_list=${study_circle_list}`);
    } else {
      condition.push(`study_circle_list=0`);
    }
    condition.push(`dim_ra_cube_id='${dim_ra_cube_id}'`);
    if (limit) {
      condition.push(`limit_value=${limit}`);
    }
    if (offset || offset == 0) condition.push(`offset_value=${offset}`);

    if (condition.length > 0) {
      cond = `?${condition.join('&')}`;
    }
    let result = await https.get(`/named_query/${name}${cond}`);
    // console.log('result RA-STUD-SUMM-01 Day wise', result);
    return result?.data?.data;
  } catch (err) {
    // console.log(err);
    throw err;
  }
};

// RA-STUD-SUMM-02:Monthwise Fetch list of students
export const fetchMonthWiseStudentSummary = async (assessment_month, study_circle_list, dim_ra_cube_id, limit, offset) => {
  const name = 'RA-STUD-SUMM-02';
  try {
    let condition = [],
      cond = '';
    if (!assessment_month || !dim_ra_cube_id) {
      throw Error({ message: 'Please provide valid inputs' });
    }
    condition.push(`assessment_month='${assessment_month}'`);
    if (study_circle_list) {
      condition.push(`study_circle_list=${study_circle_list}`);
    } else {
      condition.push(`study_circle_list=0`);
    }
    condition.push(`dim_ra_cube_id='${dim_ra_cube_id}'`);
    if (limit) {
      condition.push(`limit_value=${limit}`);
    }
    if (offset || offset == 0) condition.push(`offset_value=${offset}`);

    if (condition.length > 0) {
      cond = `?${condition.join('&')}`;
    }
    let result = await https.get(`/named_query/${name}${cond}`);
    // console.log('result RA-STUD-SUMM-02 Month Wise', result);
    return result?.data?.data;
  } catch (err) {
    // console.log(err);
    throw err;
  }
};

// RA-STUD-SUMM-03:Periodwise Fetch list of students
export const fetchYearWiseStudentSummary = async (academic_period_id, study_circle_list, dim_ra_cube_id, limit, offset) => {
  const name = 'RA-STUD-SUMM-03';
  try {
    let condition = [],
      cond = '';
    if (!academic_period_id || !dim_ra_cube_id) {
      throw Error({ message: 'Please provide valid inputs' });
    }
    condition.push(`academic_period_id=${academic_period_id}`);
    if (study_circle_list) {
      condition.push(`study_circle_list=${study_circle_list}`);
    } else {
      condition.push(`study_circle_list=0`);
    }
    condition.push(`dim_ra_cube_id='${dim_ra_cube_id}'`);
    if (limit) {
      condition.push(`limit_value=${limit}`);
    }
    if (offset || offset == 0) condition.push(`offset_value=${offset}`);

    if (condition.length > 0) {
      cond = `?${condition.join('&')}`;
    }
    let result = await https.get(`/named_query/${name}${cond}`);
    // console.log('result RA-STUD-SUMM-03 Year Wise', result);
    return result?.data?.data;
  } catch (err) {
    // console.log(err);
    throw err;
  }
};
