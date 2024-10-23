import https from '../config/init/https';

// RA-DD-01: Retrieve list of all Assessment Modes
export const fetchAssessmentModes = async () => {
  const name = 'RA-DD-01';
  try {
    let modes = await https.get(`/named_query/${name}`);
    // console.log('modes', modes);
    return modes?.data?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// RA-DD-02: Get the list of Assessment Types
export const fetchAssesmentTypes = async () => {
  const name = 'RA-DD-02';
  try {
    let assessmentType = await https.get(`/named_query/${name}`);
    // console.log('modes', modes);
    return assessmentType?.data?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// RA-DD-03: Get the list of Assessment Types
export const fetchOrganisersList = async () => {
  const name = 'RA-DD-03';
  try {
    let organisers = await https.get(`/named_query/${name}`);
    // console.log('modes', modes);
    return organisers?.data?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// RA-DD-SC-04: List the Study Circles in the Institution
export const fetchStudyCirclesList = async (institution_id, board_id, academic_period_id) => {
  const name = 'RA-DD-SC-04';
  try {
    let condition = [],
      cond = '';
    if (institution_id) {
      condition.push(`institution_id=${institution_id}`);
    }
    if (board_id) {
      condition.push(`board_id=${board_id}`);
    }
    if (academic_period_id) {
      condition.push(`academic_period_id=${academic_period_id}`);
    } else {
      condition.push(`academic_period_id=${-1}`);
    }

    if (condition.length > 0) {
      cond = `?${condition.join('&')}`;
    }
    let studyCircles = await https.get(`/named_query/${name}${cond}`);
    return studyCircles?.data?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// RA-DD-05: Get the List of Subjects for Given Study Circle
export const fetchSubjects = async (study_circle_id) => {
  if (study_circle_id) {
    const name = 'RA-DD-05';
    try {
      let condition = [],
        cond = '';
      if (study_circle_id) {
        condition.push(`study_circle_id=${study_circle_id}`);
      }

      if (condition.length > 0) {
        cond = `?${condition.join('&')}`;
      }

      let result = await https.get(`/named_query/${name}${cond}`);

      return result?.data?.data;
    } catch (err) {
      console.log(err);

      throw err;
    }
  }
};

// RA-DD-06: Retrieve List of Sub Subjects for Subject
export const fetchSubSubject = async (study_circle_id, subject_id) => {
  const name = 'RA-DD-06';
  try {
    let condition = [],
      cond = '';
    if (study_circle_id) {
      condition.push(`study_circle_id=${study_circle_id}`);
    }
    if (subject_id) {
      condition.push(`subject_id=${subject_id}`);
    }

    if (condition.length > 0) {
      cond = `?${condition.join('&')}`;
    }
    let result = await https.get(`/named_query/${name}${cond}`);
    return result?.data?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// RA-DD-07: Retrieve List of topics for Sub Subjects
export const fetchTopic = async (study_circle_id, subject_id, sub_subject_id) => {
  const name = 'RA-DD-07';
  try {
    let condition = [],
      cond = '';
    if (study_circle_id) {
      condition.push(`study_circle_id=${study_circle_id}`);
    }
    if (subject_id) {
      condition.push(`subject_id=${subject_id}`);
    }
    if (sub_subject_id) {
      condition.push(`sub_subject_id=${sub_subject_id}`);
    }

    if (condition.length > 0) {
      cond = `?${condition.join('&')}`;
    }
    let result = await https.get(`/named_query/${name}${cond}`);
    return result?.data?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// RA-DD-08: Retrieve List of topics for Sub Subjects
export const fetchSubTopic = async (study_circle_id, subject_id, sub_subject_id, topic_id) => {
  const name = 'RA-DD-08';
  try {
    let condition = [],
      cond = '';
    if (study_circle_id) {
      condition.push(`study_circle_id=${study_circle_id}`);
    }
    if (subject_id) {
      condition.push(`subject_id=${subject_id}`);
    }
    if (sub_subject_id) {
      condition.push(`sub_subject_id=${sub_subject_id}`);
    }
    if (topic_id) {
      condition.push(`topic_id=${topic_id}`);
    }
    if (condition.length > 0) {
      cond = `?${condition.join('&')}`;
    }
    let result = await https.get(`/named_query/${name}${cond}`);
    return result?.data?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// RA-DD-09: Retrieve List of Objectives
export const fetchObjectives = async (subject_id) => {
  const name = 'RA-DD-09';
  try {
    let condition = [],
      cond = '';
    if (subject_id) {
      condition.push(`subject_id=${subject_id}`);
    }
    if (condition.length > 0) {
      cond = `?${condition.join('&')}`;
    }
    let result = await https.get(`/named_query/${name}${cond}`);
    return result?.data?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
