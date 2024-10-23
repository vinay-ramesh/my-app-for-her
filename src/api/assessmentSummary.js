import https from '../config/init/https';

// RA-ASMT-SUMM-01:Daywise Assessments Summary
export const fetchDayWiseAssessmentSummary = async (
  assessment_date,
  study_circle_id_list,
  assessment_mode_id_list,
  assessment_organizer_id_list,
  assessment_type_id_list,
  subject_id_list,
  academic_period_id,
) => {
  const name = 'RA-ASMT-SUMM-01';
  try {
    let condition = [],
      cond = '';
    if (!assessment_date) {
      throw Error({ message: 'Please provide valid inputs' });
    }
    condition.push(`assessment_date='${assessment_date}'`);
    if (study_circle_id_list) {
      condition.push(`study_circle_id_list=${study_circle_id_list}`);
    } else {
      condition.push(`study_circle_id_list=0`);
    }
    if (assessment_mode_id_list) {
      condition.push(`assessment_mode_id_list=${assessment_mode_id_list}`);
    }
    if (assessment_organizer_id_list) {
      condition.push(`assessment_organizer_id_list=${assessment_organizer_id_list}`);
    }
    if (assessment_type_id_list) {
      condition.push(`assessment_type_id_list=${assessment_type_id_list}`);
    }
    if (subject_id_list) {
      condition.push(`subject_id_list=${subject_id_list}`);
    }
    condition.push(`academic_period_id=${academic_period_id}`);
    if (condition.length > 0) {
      cond = `?${condition.join('&')}`;
    }
    let result = await https.get(`/named_query/${name}${cond}`);
    // console.log('result  RA-ASMT-SUMM-01:Daywise Assessments Summary', result);
    return result?.data?.data;
  } catch (err) {
    console.log('err in  RA-ASMT-SUMM-01:Daywise Assessments Summary', err);
    throw err;
  }
};

// RA-ASMT-SUMM-02:Monthwise Assessments Summary
export const fetchMonthWiseAssessmentSummary = async (
  assessment_month,
  study_circle_id_list,
  assessment_mode_id_list,
  assessment_organizer_id_list,
  assessment_type_id_list,
  subject_id_list,
  academic_period_id,
) => {
  const name = 'RA-ASMT-SUMM-02';

  try {
    let condition = [],
      cond = '';
    if (!assessment_month) {
      throw Error({ message: 'Please provide valid inputs' });
    }
    condition.push(`assessment_month='${assessment_month}'`);
    if (study_circle_id_list) {
      condition.push(`study_circle_id_list=${study_circle_id_list}`);
    } else {
      condition.push(`study_circle_id_list=0`);
    }
    if (assessment_mode_id_list) {
      condition.push(`assessment_mode_id_list=${assessment_mode_id_list}`);
    }
    if (assessment_organizer_id_list) {
      condition.push(`assessment_organizer_id_list=${assessment_organizer_id_list}`);
    }
    if (assessment_type_id_list) {
      condition.push(`assessment_type_id_list=${assessment_type_id_list}`);
    }
    if (subject_id_list) {
      condition.push(`subject_id_list=${subject_id_list}`);
    }
    condition.push(`academic_period_id=${academic_period_id}`);

    if (condition.length > 0) {
      cond = `?${condition.join('&')}`;
    }
    let result = await https.get(`/named_query/${name}${cond}`);
    // console.log('result  RA-ASMT-SUMM-02:Monthwise Assessments Summary', result);
    return result?.data?.data;
  } catch (err) {
    console.log('err in  RA-ASMT-SUMM-02:Monthwise Assessments Summary', err);
    throw err;
  }
};

// RA-ASMT-SUMM-03:AcademicPeriodwise Assessments Summary
export const fetchYearWiseAssessmentSummary = async (
  academic_period_id,
  study_circle_id_list,
  assessment_mode_id_list,
  assessment_organizer_id_list,
  assessment_type_id_list,
  subject_id_list,
) => {
  const name = 'RA-ASMT-SUMM-03';
  try {
    let condition = [],
      cond = '';
    if (!academic_period_id) {
      throw Error({ message: 'Please provide valid inputs' });
    }
    condition.push(`academic_period_id=${+academic_period_id}`);
    if (study_circle_id_list) {
      condition.push(`study_circle_id_list=${study_circle_id_list}`);
    } else {
      condition.push(`study_circle_id_list=0`);
    }
    if (assessment_mode_id_list) {
      condition.push(`assessment_mode_id_list=${assessment_mode_id_list}`);
    }
    if (assessment_organizer_id_list) {
      condition.push(`assessment_organizer_id_list=${assessment_organizer_id_list}`);
    }
    if (assessment_type_id_list) {
      condition.push(`assessment_type_id_list=${assessment_type_id_list}`);
    }
    if (subject_id_list) {
      condition.push(`subject_id_list=${subject_id_list}`);
    }

    if (condition.length > 0) {
      cond = `?${condition.join('&')}`;
    }
    let result = await https.get(`/named_query/${name}${cond}`);
    // console.log('result  RA-ASMT-SUMM-03:AcademicPeriodwise Assessments Summary', result);
    return result?.data?.data;
  } catch (err) {
    console.log('err in  RA-ASMT-SUMM-03:AcademicPeriodwise Assessments Summary', err, err?.message);
    throw err;
  }
};
