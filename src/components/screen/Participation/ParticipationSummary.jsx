import React, { useState, useContext, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Table from '../../common/Table/Table';
import SelectInput from '../../common/SelectInput/SelectInput';
import ImageAssets from '../../../assets/imageAsset';
import DateSelector from '../../common/DateSelector/DateSelector';
import moment from 'moment';
import promiseAllCall from '../../../utils/promiseCallAll/promise';
import secureLocalStorage from 'react-secure-storage';
import { CONST_ALL_SPLIT } from '../../../utils/Constants/constants';
import { sideBarLayout } from '../../layout/layout';
import { fetchAssesmentTypes, fetchAssessmentModes, fetchOrganisersList, fetchStudyCirclesList } from '../../../api/master_data';
import { fetchIndividualAcademicPeriod } from '../../../api/academicPeriod';
import { combineArrays } from '../../../utils/GenerateHash/GenerateCombination';
import { participationSummaryTableCol } from '../../../utils/tableColumns/participationSummaryTableCol';
import { fetchDayWiseParticipationSummary, fetchMonthWiseParticipationSummary } from '../../../api/participation';
import { fetchYearWiseParticipationSummary } from './../../../api/participation';

const ParticipationSummary = () => {
  const participationSelectedDropdowns = JSON.parse(localStorage.getItem('participationSelectedDropdowns'));
  const selectedDatefromLocalStorage = localStorage?.getItem('selectedDate')
    ? localStorage?.getItem('selectedDate')
    : moment(new Date())?.format('YYYY-MM-DD');
  const selectedMode = localStorage.getItem('datemode');

  const [options, setOptions] = useState({
    modes: [],
    assessments: [],
    organisers: [],
    studyCircles: [],
    subjects: [],
  });
  const [selectedValues, setSelectedValues] = useState({
    modeId: participationSelectedDropdowns?.modeId ? participationSelectedDropdowns?.modeId : null,
    assessmentId: participationSelectedDropdowns?.assessmentId ? participationSelectedDropdowns?.assessmentId : null,
    organiserId: participationSelectedDropdowns?.organiserId ? participationSelectedDropdowns?.organiserId : null,
    studyCircleId: participationSelectedDropdowns?.studyCircleId ? participationSelectedDropdowns?.studyCircleId : CONST_ALL_SPLIT,
    subjectId: participationSelectedDropdowns?.subjectId ? participationSelectedDropdowns?.subjectId : null,
    academicPeriodId: participationSelectedDropdowns?.academicPeriodId ? participationSelectedDropdowns?.academicPeriodId : null,
  });
  const [mode, setMode] = useState(selectedMode ? selectedMode : 'M');
  const [selectedDate, setSelectedDate] = useState(selectedDatefromLocalStorage);
  const [tableData, setTableData] = useState([]);
  const [participationData, setParticipationData] = useState([]);
  const [count, setCount] = useState(0);
  const [hashValue, setHashValue] = useState('');

  const contextValues = useContext(sideBarLayout);
  const academicPeriods = contextValues?.academicPeriodList;
  const institutionId = secureLocalStorage.getItem('cmn_school_id');
  const boardId = contextValues?.selected_board_id;
  const sortedAcademicPerArr =
    academicPeriods?.length > 0
      ? academicPeriods?.sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
      : console.log('Could not find academic period list to find academic start date and academic end date!');
  const academicStartDate = sortedAcademicPerArr?.length > 0 && sortedAcademicPerArr[0]?.start_date;
  const academicEndDate = sortedAcademicPerArr?.length > 0 && sortedAcademicPerArr[sortedAcademicPerArr?.length - 1]?.end_date;

  // Pagination
  const limit = 10;
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    setOffset(limit * (pageNumber - 1));
  };

  // update localStorage
  useEffect(() => {
    console.log('selectedValues inside useEffect', selectedValues);
    localStorage.setItem('participationSelectedDropdowns', JSON.stringify(selectedValues));
    return () => {
      localStorage.removeItem('participationSelectedDropdowns');
    };
  }, [
    selectedValues.modeId,
    selectedValues.assessmentId,
    selectedValues.organiserId,
    selectedValues.academicPeriodId,
    selectedValues.studyCircleId,
    selectedValues.subjectId,
    selectedDate,
  ]);

  // fetch mode, assessment, organiser dropdows with no dependency
  useEffect(() => {
    // console.log('I am coming fetchAll1');
    const fetchAll = async () => {
      const fetchDropdowns = await promiseAllCall([fetchAssessmentModes(), fetchAssesmentTypes(), fetchOrganisersList()]);
      // console.log('fetchDropdowns', fetchDropdowns, Array.isArray(fetchDropdowns[3]), !fetchDropdowns[3] instanceof Error);
      if (fetchDropdowns.length > 0) {
        if (fetchDropdowns[0] && Array.isArray(fetchDropdowns[0])) {
          setOptions((prevState) => {
            return {
              ...prevState,
              modes: [
                {
                  assessment_mode_id: CONST_ALL_SPLIT,
                  code: 'all_split',
                  name: 'All Split (Mode)',
                },
                ...fetchDropdowns[0],
              ],
            };
          });
        }
        if (fetchDropdowns[1] && Array.isArray(fetchDropdowns[1])) {
          setOptions((prevState) => {
            return {
              ...prevState,
              assessments: [
                {
                  assessment_type_id: CONST_ALL_SPLIT,
                  code: 'all_split',
                  name: 'All Split (Assessment Type)',
                },
                ...fetchDropdowns[1],
              ],
            };
          });
        }
        if (fetchDropdowns[2] && Array.isArray(fetchDropdowns[2])) {
          setOptions((prevState) => {
            return {
              ...prevState,
              organisers: [
                {
                  organiser_type_id: CONST_ALL_SPLIT,
                  code: 'all_split',
                  name: 'All Split (Organisers)',
                },
                ...fetchDropdowns[2],
              ],
            };
          });
        }
      } else {
        toast.info('No dropdown values found for Mode, Assessments, Organisers', { duration: TOAST_DURATION });
      }
    };
    try {
      fetchAll();
    } catch (err) {
      console.log('Error in fetching dropdown values', err);
    }
  }, []);

  // fetch academic period for corresponding date and boardId
  useEffect(() => {
    const fetchAcademicPeriod = async () => {
      try {
        const date = moment(selectedDate).format('YYYY-MM-DD');
        const academicPeriodForDate = await fetchIndividualAcademicPeriod(boardId, date);
        // console.log('academicPeriodForDate selectedValues', academicPeriodForDate);
        if (!academicPeriodForDate) {
          toast.error('No Study Circles found for selected board', { duration: TOAST_DURATION });
          return;
        }
        setSelectedValues((prevState) => {
          return { ...prevState, academicPeriodId: academicPeriodForDate?.academic_period_id };
        });
        // localStorage.setItem('academicPeriodForDate', JSON.stringify(academicPeriodForDate));
      } catch (err) {
        console.log('error in fetching inidividual academic period', err);
      }
    };
    fetchAcademicPeriod();
  }, [selectedDate, boardId]);

  // get new study circles for selected date and boardId, academic_period_id
  useEffect(() => {
    const fetchStudyCirles = async () => {
      //   console.log('selectedValues ', selectedValues);
      try {
        const studyCircles = await fetchStudyCirclesList(institutionId, boardId, selectedValues.academicPeriodId);
        // console.log('studyCircles', studyCircles);
        setOptions((prevState) => {
          return { ...prevState, studyCircles: studyCircles };
        });
      } catch (err) {
        console.log('error in fetching study cirlces list', err);
      }
    };
    fetchStudyCirles();
  }, [boardId, selectedValues.academicPeriodId]);

  // generate hash
  useEffect(() => {
    // All Split - Mode, organiser, assessment, subjects
    // All split - by default - Study circle
    const dropdownValues = {
      assessment_mode_id:
        selectedValues.modeId == CONST_ALL_SPLIT
          ? options?.modes.filter((ele) => ele.assessment_mode_id !== CONST_ALL_SPLIT).map((ele) => ele.assessment_mode_id)
          : [selectedValues.modeId],
      assessment_type_id:
        selectedValues.assessmentId == CONST_ALL_SPLIT
          ? options?.assessments.filter((ele) => ele.assessment_type_id !== CONST_ALL_SPLIT).map((ele) => ele.assessment_type_id)
          : [selectedValues.assessmentId],
      assessment_organizer_id:
        selectedValues.organiserId == CONST_ALL_SPLIT
          ? options?.organisers.filter((ele) => ele.organiser_type_id !== CONST_ALL_SPLIT).map((ele) => ele.organiser_type_id)
          : [selectedValues.organiserId],
      assessment_subject_id:
        selectedValues.subjectId == CONST_ALL_SPLIT
          ? options?.subjects.filter((ele) => ele.subject_id !== CONST_ALL_SPLIT).map((ele) => ele.subject_id)
          : [selectedValues.subjectId],
      question_sub_subject_id: [null],
      question_topic_id: [null],
      question_sub_topic_id: [null],
      question_object: [null],
    };
    const hashedValue = combineArrays(dropdownValues);
    const formatHashedValues = hashedValue
      .map((ele) => `'${ele}'`)
      .join(',')
      ?.slice(1, -1);
    setHashValue(formatHashedValues);
  }, [selectedValues.modeId, selectedValues.assessmentId, selectedValues.organiserId, selectedValues.subjectId]);

  // fetch Participation data
  useEffect(() => {
    const fetchParticipationData = async () => {
      const toastId = toast.loading('Fetching data!!');
      try {
        if (mode === 'D' && hashValue?.length > 0) {
          if (selectedValues.studyCircleId == CONST_ALL_SPLIT) {
            const studyCircleIdString = options.studyCircles
              ?.filter((ele) => ele.study_circle_id !== CONST_ALL_SPLIT)
              .map((ele) => ele?.study_circle_id)
              .join(',');
            if (studyCircleIdString) {
              const participationTableData = await fetchDayWiseParticipationSummary(
                institutionId,
                moment(selectedDate).format('YYYY-MM-DD'),
                studyCircleIdString,
                hashValue,
              );
              setTableData(participationTableData);
              setCount(participationTableData?.length);
            }
          } else {
            const participationTableData = await fetchDayWiseParticipationSummary(
              institutionId,
              moment(selectedDate).format('YYYY-MM-DD'),
              selectedValues.studyCircleId,
              hashValue,
            );
            setTableData(participationTableData);
            setCount(participationTableData?.length);
          }
        }
        if (mode === 'M' && hashValue.length > 0) {
          const presentYear = new Date(selectedDate).getFullYear();
          const presentMonth = new Date(selectedDate).getMonth();
          const date = new Date(presentYear, presentMonth, 1);
          //   console.log('date inside mode', date, moment(date).format('YYYY-MM-DD'));
          if (selectedValues.studyCircleId == CONST_ALL_SPLIT) {
            const studyCircleIdString = options.studyCircles
              ?.filter((ele) => ele.study_circle_id !== CONST_ALL_SPLIT)
              .map((ele) => ele?.study_circle_id)
              .join(',');
            if (studyCircleIdString) {
              const participationTableData = await fetchMonthWiseParticipationSummary(
                institutionId,
                moment(date).format('YYYY-MM-DD'),
                studyCircleIdString,
                hashValue,
              );
              setTableData(participationTableData);
              setCount(participationTableData?.length);
              setOffset(0);
              setCurrentPage(1);
            }
          } else {
            const participationTableData = await fetchMonthWiseStudyCircleSummary(
              institutionId,
              moment(date).format('YYYY-MM-DD'),
              selectedValues.studyCircleId,
              hashValue,
            );
            setTableData(participationTableData);
            setCount(participationTableData?.length);
            setOffset(0);
            setCurrentPage(1);
          }
        }
        if (mode === 'Y' && hashValue?.length > 0) {
          if (selectedValues.studyCircleId == CONST_ALL_SPLIT) {
            const studyCircleIdString = options.studyCircles
              ?.filter((ele) => ele.study_circle_id !== CONST_ALL_SPLIT)
              .map((ele) => ele?.study_circle_id)
              .join(',');
            if (studyCircleIdString) {
              const participationTableData = await fetchYearWiseParticipationSummary(
                institutionId,
                selectedValues.academicPeriodId,
                studyCircleIdString,
                hashValue,
              );
              setTableData(participationTableData);
              setCount(participationTableData?.length);
              setOffset(0);
              setCurrentPage(1);
            }
          } else {
            const participationTableData = await fetchYearWiseParticipationSummary(
              institutionId,
              selectedValues.academicPeriodId,
              selectedValues.studyCircleId,
              hashValue,
            );
            setTableData(participationTableData);
            setCount(participationTableData?.length);
            setOffset(0);
            setCurrentPage(1);
          }
        }
        toast.success('Data fetched successfully', { id: toastId });
      } catch (err) {
        console.log('error in fetching study circle data', err);
        err?.code == 'ERR_CANCELED' ? toast.dismiss() : toast.error('Error in fetching study circle data', { id: toastId });
      }
    };
    hashValue?.length > 0 && fetchParticipationData();
    return () => {
      toast.dismiss();
    };
  }, [
    mode,
    hashValue,
    selectedValues.academicPeriodId,
    selectedValues.studyCircleId,
    selectedDate,
    JSON.stringify(options.studyCircles),
  ]);

  // paginate assessment data
  useEffect(() => {
    const startIndex = currentPage * limit - 10;
    const endIndex = currentPage * limit;
    const localData = [...tableData];
    const paginatedData = localData?.slice(startIndex, endIndex);
    // console.log('paginatedData', paginatedData);
    setParticipationData(paginatedData);
  }, [offset, currentPage, JSON.stringify(tableData)]);

  const handleChange = (dateSelected) => {
    setSelectedDate(dateSelected);
    localStorage.setItem('selectedDate', dateSelected);
  };

  const getMeColor = (avg_velocity) => {
    return avg_velocity <= 0.39
      ? 'bg-red-300 text-red-600'
      : avg_velocity <= 0.59
        ? 'bg-yellow-200 text-yellow-500'
        : avg_velocity <= 0.79
          ? 'bg-blue-300 text-blue-700'
          : 'bg-green-200 text-green-500';
  };

  return (
    <>
      <div className="w-full h-full sm:h-[700px] flex flex-col gap-y-2 overflow-auto">
        <div className="min-h-[7%] flex items-center justify-between w-full sm:block sm:min-h-fit md:min-h-fit md:flex-col md:items-baseline relative z-[1]">
          <div className="flex flex-wrap items-center justify-between sm:items-start w-full sm:h-auto h-full">
            <div className="flex items-center w-auto sm:h-auto h-full gap-x-2 text-sm sm:text-sm md:text-md lg:text-md xl:text-lg 2xl:text-xl sm:mb-2">
              <h3>Total</h3> - <div>{tableData?.length ?? 0}</div>
            </div>
            <div>
              <DateSelector
                mode={mode}
                setMode={(e) => {
                  setMode(e);
                }}
                selectedDate={selectedDate}
                handleChange={(e) => {
                  setSelectedValues((pre) => ({
                    ...pre,
                    studyCircleId: CONST_ALL_SPLIT,
                  }));
                  handleChange(e);
                }}
                setSelectedValues={(e) => {
                  setSelectedValues((prevState) => ({ ...prevState, academicPeriodId: e }));
                }}
                academic_period_id={selectedValues?.academicPeriodId}
              />
            </div>
          </div>
        </div>
        <div className=" sm:min-h-fit md:min-h-fit  grid grid-cols-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-col-4 gap-2 content-center pb-1">
          <SelectInput
            options={options?.modes?.map((i) => ({ label: i?.name, value: i?.assessment_mode_id })) || []}
            placeholder="All Mode"
            name="mode"
            idName="modeId"
            handleChange={(e) => {
              console.log('selected inside handleChange', e, e?.value);
              if (e !== null) {
                setSelectedValues({
                  ...selectedValues,
                  modeId: e.value,
                });
              } else {
                setSelectedValues({
                  ...selectedValues,
                  modeId: null,
                });
              }
            }}
            value={options?.modes
              ?.map((i) => ({ label: i?.name, value: i.assessment_mode_id }))
              ?.filter((i) => i?.value == selectedValues?.modeId)}
            isClearable
            key={1}
          />
          <SelectInput
            options={options?.assessments?.map((i) => ({ label: i?.name, value: i?.assessment_type_id })) || []}
            placeholder="All Assessments"
            displayName=""
            name="assessments"
            idName="assessmentId"
            handleChange={(e) => {
              if (e !== null) {
                setSelectedValues({
                  ...selectedValues,
                  assessmentId: e.value,
                });
              } else {
                setSelectedValues({
                  ...selectedValues,
                  assessmentId: null,
                });
              }
            }}
            value={options?.assessments
              ?.map((i) => ({ label: i?.name, value: i.assessment_type_id }))
              ?.filter((i) => i?.value === selectedValues?.assessmentId)}
            isClearable
            key={2}
          />
          <SelectInput
            options={options?.organisers?.map((i) => ({ label: i?.name, value: i?.organiser_type_id })) || []}
            placeholder="All Organisers"
            displayName=""
            name="organisers"
            idName="organiserId"
            handleChange={(e) => {
              if (e !== null) {
                setSelectedValues({
                  ...selectedValues,
                  organiserId: e.value,
                });
              } else {
                setSelectedValues({
                  ...selectedValues,
                  organiserId: null,
                });
              }
            }}
            value={options?.organisers
              ?.map((i) => ({ label: i?.name, value: i.organiser_type_id }))
              ?.filter((i) => i?.value === selectedValues?.organiserId)}
            isClearable
            key={3}
          />
          <SelectInput
            options={[
              { label: 'All Split (Study circles)', value: CONST_ALL_SPLIT },
              ...(options?.studyCircles?.map((i) => ({ label: i?.sc_name, value: i?.study_circle_id })) || []),
            ]}
            placeholder="All Split (Study Circles)"
            displayName=""
            name="studyCircles"
            idName="studyCircleId"
            handleChange={(e) => {
              if (e !== null) {
                setSelectedValues({
                  ...selectedValues,
                  studyCircleId: e.value,
                  subjectId: null,
                });
              } else {
                setSelectedValues({
                  ...selectedValues,
                  studyCircleId: CONST_ALL_SPLIT,
                });
              }
            }}
            value={options?.studyCircles
              ?.map((i) => ({ label: i?.sc_name, value: i.study_circle_id }))
              ?.filter((i) => i?.value == selectedValues?.studyCircleId)}
            // isClearable
            key={4}
          />
          <SelectInput
            options={options?.subjects?.map((i) => ({ label: i?.subject, value: i?.subject_id })) || []}
            placeholder="All Subject"
            displayName=""
            name="subjects"
            idName="subjectId"
            handleChange={(e) => {
              if (e !== null) {
                setSelectedValues({
                  ...selectedValues,
                  subjectId: e.value,
                });
              } else {
                setSelectedValues({
                  ...selectedValues,
                  subjectId: null,
                });
              }
            }}
            value={options?.subjects
              ?.map((i) => ({ label: i?.subject, value: i.subject_id }))
              ?.filter((i) => i?.value == selectedValues?.subjectId)}
            isClearable
            key={5}
          />
        </div>
        {participationData.length ? (
          <Table
            paginate={paginate}
            count={count}
            limit={limit}
            currentPage={currentPage}
            offset={offset}
            studentData={participationData}
            columns={participationSummaryTableCol}
            getMeColor={getMeColor}
            mode={mode}
            keyName="study_circle_id"
          />
        ) : (
          <div className="w-full bg-white p-10 h-auto lg:h-[45vh] xl:h-[50vh]">
            <div colSpan={10} className="text-center">
              <img src={ImageAssets.noDataImg} alt="no-data-found" className="m-auto xs:h-[10vh] sm:h-[15vh] md:h-[18vh] " />
              <div className="mx-auto mt-2 text-black font-medium">{'No Data Found'}</div>
            </div>
          </div>
        )}
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default ParticipationSummary;
