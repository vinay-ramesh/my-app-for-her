import https from '../config/init/https';

// RA-AP-02: Get academic periods for given board id
export const fetchAcademicPeriodList = async (boardId) => {
  const name = 'RA-AP-02';
  try {
    let academicPeriodList = await https.get(`/named_query/${name}?board_id=${boardId}`);
    // console.log('academicPeriodList', academicPeriodList);
    return academicPeriodList?.data?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// RA-AP-01: Get academic period for given board id and date
export const fetchIndividualAcademicPeriod = async (boardId, selectedDate) => {
  const name = 'RA-AP-01';
  try {
    let academicPeriod = await https.get(`/named_query/${name}?board_id=${boardId}&date='${selectedDate}'`);
    // console.log('academicPeriod', academicPeriod);
    return academicPeriod?.data?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
