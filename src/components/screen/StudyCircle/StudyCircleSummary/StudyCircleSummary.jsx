import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { sideBarLayout } from '../../../layout/layout';
import secureLocalStorage from 'react-secure-storage';
import SelectInput from '../../../common/SelectInput/SelectInput';
import DateSelector from '../../../common/DateSelector/DateSelector';
import moment from 'moment';
import Table from '../../../common/Table/Table';
import promiseAllCall from '../../../../utils/promiseCallAll/promise';
import {
  fetchAssessmentModes,
  fetchAssesmentTypes,
  fetchOrganisersList,
  fetchStudyCirclesList,
  fetchSubjects,
  fetchSubSubject,
  fetchTopic,
  fetchSubTopic,
  fetchObjectives,
} from '../../../../api/master_data';
import { combineArrays } from '../../../../utils/GenerateHash/GenerateCombination';
import { studyCircleSummaryCol } from '../../../../utils/tableColumns/studyCircleSummaryTableCol';
import { fetchIndividualAcademicPeriod } from '../../../../api/academicPeriod';
import {
  fetchDayWiseStudyCircleSummary,
  fetchMonthWiseStudyCircleSummary,
  fetchYearWiseStudyCircleSummary,
} from '../../../../api/studyCircleSummary';
import { fetchYearWiseStudentSummary } from '../../../../api/studentsSummary';
import { CONST_ALL_SPLIT, TOAST_DURATION } from '../../../../utils/Constants/constants';
import ImageAssets from '../../../../assets/imageAsset';

const StudyCircleSummary = () => {
  const studyCircleSelectedDropdownValues = JSON.parse(localStorage.getItem('studyCircleSelectedDropdownValues'));
  const selectedDatefromLocalStorage = localStorage?.getItem('selectedDate') || moment(new Date())?.format('YYYY-MM-DD');
  const selectedMode = localStorage.getItem('datemode');

  const navigate = useNavigate();
  const [options, setOptions] = useState({
    modes: [],
    assessments: [],
    organisers: [],
    studyCircles: [],
    subjects: [],
    subSubjects: [],
    topics: [],
    subTopics: [],
    objectives: [],
  });
  const [selectedValues, setSelectedValues] = useState({
    modeId: studyCircleSelectedDropdownValues?.modeId ? studyCircleSelectedDropdownValues?.modeId : null,
    assessmentId: studyCircleSelectedDropdownValues?.assessmentId ? studyCircleSelectedDropdownValues?.assessmentId : null,
    organiserId: studyCircleSelectedDropdownValues?.organiserId ? studyCircleSelectedDropdownValues?.organiserId : null,
    studyCircleId: studyCircleSelectedDropdownValues?.studyCircleId
      ? studyCircleSelectedDropdownValues?.studyCircleId
      : CONST_ALL_SPLIT,
    subjectId: studyCircleSelectedDropdownValues?.subjectId ? studyCircleSelectedDropdownValues?.subjectId : null,
    subSubjectId: studyCircleSelectedDropdownValues?.subSubjectId ? studyCircleSelectedDropdownValues?.subSubjectId : null,
    topidId: studyCircleSelectedDropdownValues?.topidId ? studyCircleSelectedDropdownValues?.topidId : null,
    subtopicId: studyCircleSelectedDropdownValues?.subtopicId ? studyCircleSelectedDropdownValues?.subtopicId : null,
    academicPeriodId: studyCircleSelectedDropdownValues?.academicPeriodId
      ? studyCircleSelectedDropdownValues?.academicPeriodId
      : null,
    objectiveId: studyCircleSelectedDropdownValues?.objectiveId ? studyCircleSelectedDropdownValues?.objectiveId : null,
  });
  const [mode, setMode] = useState(selectedMode ? selectedMode : 'M');
  const [selectedDate, setSelectedDate] = useState(selectedDatefromLocalStorage);
  const [count, setCount] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [studyCircleData, setStudyCircleData] = useState([]);
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
    // console.log('selectedValues inside useEffect', selectedValues);
    localStorage.setItem('studyCircleSelectedDropdownValues', JSON.stringify(selectedValues));
    return () => {
      localStorage.removeItem('studyCircleSelectedDropdownValues');
    };
  }, [
    selectedValues.modeId,
    selectedValues.assessmentId,
    selectedValues.organiserId,
    selectedValues.objectiveId,
    selectedValues.academicPeriodId,
    selectedValues.studyCircleId,
    selectedValues.subjectId,
    selectedValues.subSubjectId,
    selectedValues.topidId,
    selectedValues.subtopicId,
    selectedDate,
  ]);

  // fetch mode, assessment, organiser, objective dropdows with no dependency
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

  // store the selected dropdown dependencies
  useEffect(() => {
    const fetchDropdownDependencies = async () => {
      const fetchDependencyValues = await promiseAllCall([
        fetchSubjects(selectedValues.studyCircleId),
        selectedValues.subjectId > 0 && fetchSubSubject(selectedValues.studyCircleId, selectedValues.subjectId),
        selectedValues.subjectId > 0 &&
          fetchTopic(selectedValues.studyCircleId, selectedValues.subjectId, selectedValues.subSubjectId),
        selectedValues.topidId > 0 &&
          fetchSubTopic(
            selectedValues.studyCircleId,
            selectedValues.subjectId,
            selectedValues.subSubjectId,
            selectedValues.topidId,
          ),
        selectedValues.subjectId > 0 ? fetchObjectives(selectedValues.subjectId) : fetchObjectives(null),
      ]);

      // console.log('fetchDependencyValues', fetchDependencyValues);
      if (fetchDependencyValues.length > 0) {
        if (fetchDependencyValues[0] && Array.isArray(fetchDependencyValues[0])) {
          if (selectedValues.studyCircleId == CONST_ALL_SPLIT) {
            setOptions((prevState) => {
              return {
                ...prevState,
                subjects: [],
              };
            });
          } else {
            setOptions((prevState) => {
              return {
                ...prevState,
                subjects: [
                  {
                    subject_id: CONST_ALL_SPLIT,
                    institution_id: institutionId,
                    study_circle_id: selectedValues.studyCircleId,
                    subject: 'All Split (Subjects)',
                  },
                  ...fetchDependencyValues[0],
                ],
              };
            });
          }
        }
        if (fetchDependencyValues[1] && Array.isArray(fetchDependencyValues[1])) {
          setOptions((prevState) => {
            return { ...prevState, subSubjects: fetchDependencyValues[1] };
          });
        }
        if (fetchDependencyValues[2] && Array.isArray(fetchDependencyValues[2])) {
          setOptions((prevState) => {
            return { ...prevState, topics: fetchDependencyValues[2] };
          });
        }
        if (fetchDependencyValues[3] && Array.isArray(fetchDependencyValues[3])) {
          setOptions((prevState) => {
            return { ...prevState, subTopics: fetchDependencyValues[3] };
          });
        }
        if (fetchDependencyValues[4] && Array.isArray(fetchDependencyValues[4])) {
          setOptions((prevState) => {
            return { ...prevState, objectives: fetchDependencyValues[4] };
          });
        }
      } else {
        toast.info('No dropdown values found', { duration: TOAST_DURATION });
      }
    };
    try {
      fetchDropdownDependencies();
    } catch (err) {
      console.log('Error in fetching dropdown values', err);
    }
  }, [
    selectedValues.studyCircleId,
    selectedValues.subjectId,
    selectedValues.subSubjectId,
    selectedValues.topidId,
    selectedValues.subtopicId,
  ]);

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
      question_sub_subject_id: [selectedValues.subSubjectId],
      question_topic_id: [selectedValues.topidId],
      question_sub_topic_id: [selectedValues.subtopicId],
      question_object: [selectedValues.objectiveId],
    };
    console.log(dropdownValues, options, 'dropdownValues');
    const hashedValue = combineArrays(dropdownValues);
    const formatHashedValues = hashedValue
      .map((ele) => `'${ele}'`)
      .join(',')
      ?.slice(1, -1);
    setHashValue(formatHashedValues);
  }, [
    selectedValues.modeId,
    selectedValues.assessmentId,
    selectedValues.organiserId,
    selectedValues.subSubjectId,
    selectedValues.subjectId,
    selectedValues.topidId,
    selectedValues.subtopicId,
    selectedValues.objectiveId,
  ]);

  // fetch studyCircle data
  useEffect(() => {
    const fetchStudyCircleData = async () => {
      const toastId = toast.loading('Fetching data!!');
      try {
        if (mode === 'D' && hashValue?.length > 0) {
          if (selectedValues.studyCircleId == CONST_ALL_SPLIT) {
            const studyCircleIdString = options.studyCircles
              ?.filter((ele) => ele.study_circle_id !== CONST_ALL_SPLIT)
              .map((ele) => ele?.study_circle_id)
              .join(',');
            if (studyCircleIdString) {
              const studyCircleData = await fetchDayWiseStudyCircleSummary(
                moment(selectedDate).format('YYYY-MM-DD'),
                studyCircleIdString,
                hashValue,
                institutionId,
              );
              setTableData(studyCircleData);
              setCount(studyCircleData?.length);
            }
          } else {
            const studyCircleData = await fetchDayWiseStudyCircleSummary(
              moment(selectedDate).format('YYYY-MM-DD'),
              selectedValues.studyCircleId,
              hashValue,
              institutionId,
            );
            setTableData(studyCircleData);
            setCount(studyCircleData?.length);
          }
        }
        if (mode === 'M' && hashValue.length > 0) {
          const presentYear = new Date(selectedDate).getFullYear();
          const presentMonth = new Date(selectedDate).getMonth();
          const date = new Date(presentYear, presentMonth, 1);
          if (selectedValues.studyCircleId == CONST_ALL_SPLIT) {
            const studyCircleIdString = options.studyCircles
              ?.filter((ele) => ele.study_circle_id !== CONST_ALL_SPLIT)
              .map((ele) => ele?.study_circle_id)
              .join(',');
            if (studyCircleIdString) {
              const studyCircleData = await fetchMonthWiseStudyCircleSummary(
                moment(date).format('YYYY-MM-DD'),
                studyCircleIdString,
                hashValue,
                institutionId,
              );
              setTableData(studyCircleData);
              setCount(studyCircleData?.length);
              setOffset(0);
              setCurrentPage(1);
            }
          } else {
            const studyCircleData = await fetchMonthWiseStudyCircleSummary(
              moment(date).format('YYYY-MM-DD'),
              selectedValues.studyCircleId,
              hashValue,
              institutionId,
            );
            setTableData(studyCircleData);
            setCount(studyCircleData?.length);
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
              const studyCircleData = await fetchYearWiseStudyCircleSummary(
                selectedValues.academicPeriodId,
                studyCircleIdString,
                hashValue,
                institutionId,
              );
              setTableData(studyCircleData);
              setCount(studyCircleData?.length);
              setOffset(0);
              setCurrentPage(1);
            }
          } else {
            const studyCircleData = await fetchYearWiseStudentSummary(
              selectedValues.academicPeriodId,
              selectedValues.studyCircleId,
              hashValue,
              institutionId,
            );
            setTableData(studyCircleData);
            setCount(studyCircleData?.length);
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
    hashValue?.length > 0 && fetchStudyCircleData();
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

  // paginate studyCircle data
  useEffect(() => {
    const startIndex = currentPage * limit - 10;
    const endIndex = currentPage * limit;
    const localData = [...tableData];
    const paginatedData = localData?.slice(startIndex, endIndex);
    // console.log('paginatedData', paginatedData);
    setStudyCircleData(paginatedData);
  }, [offset, currentPage, JSON.stringify(tableData)]);

  const handleChange = (dateSelected) => {
    if (mode.isMonth && !(dateSelected instanceof Date)) {
      const date = new Date(presentYear, dateSelected, 1);

      const checkMinDate = new Date(moment(academicStartDate).format('YYYY-MM-DD')) <= new Date(moment(date).format('YYYY-MM-DD'));
      const checkMaxDate = new Date(moment(academicEndDate).format('YYYY-MM-DD')) >= new Date(moment(date).format('YYYY-MM-DD'));

      //   console.log('dateSelected', {
      //     dateSelected: moment(date).format('YYYY-MM-DD'),
      //     academicEndDate,
      //     academicStartDate,
      //     checkMaxDate,
      //     checkMinDate,
      //   });
      if (checkMaxDate && checkMinDate) {
        setSelectedDate(date);
        localStorage.setItem('selectedDate', date);
      } else {
        toast.error(
          `Please select the dates between ${moment(academicStartDate).format('DD MMM YYYY')} to ${moment(academicEndDate).format('DD MMM YYYY')}`,
        );
      }
    } else {
      setSelectedDate(dateSelected);
      localStorage.setItem('selectedDate', dateSelected);
    }
  };

  const handleStudyCircleClick = (selectedRow) => {
    const dropVal = {
      assessment_mode_id: selectedValues.modeId == -1 ? null : selectedValues.modeId,
      assessment_type_id: selectedValues.assessmentId == -1 ? null : selectedValues.assessmentId,
      assessment_organizer_id: selectedValues.organiserId == -1 ? null : selectedValues.organiserId,
      assessment_subject_id: selectedValues.subjectId == -1 ? null : selectedValues.subjectId,
      question_sub_subject_id: selectedValues.subSubjectId == -1 ? null : selectedValues.subSubjectId,
      question_topic_id: selectedValues.topidId == -1 ? null : selectedValues.topidId,
      question_sub_topic_id: selectedValues.subtopicId == -1 ? null : selectedValues.subtopicId,
      question_objective_id: selectedValues.objectiveId == -1 ? null : selectedValues.objectiveId,
    };
    window.localStorage.setItem('studyCircleFilterVal', JSON.stringify(dropVal));
    window.localStorage.setItem('datemode', mode);
    window.localStorage.setItem('selectedDate', selectedDate);
    window.localStorage.setItem('selectedAcadamicPeriod', JSON.stringify(selectedValues?.academicPeriodId));

    return navigate(`/studycircle/studycircledetails/${selectedRow.study_circle_id}`, { state: selectedRow });
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
      <div className="w-full h-full sm:h-[900px] flex flex-col gap-y-2 overflow-auto">
        <div className="min-h-[7%] flex items-center justify-between w-full sm:block sm:min-h-fit md:min-h-fit md:flex-col md:items-baseline relative z-[1]">
          <div className="flex flex-wrap sm:justify-center sm:flex-wrap-reverse items-center justify-between sm:items-start w-full sm:h-auto h-full">
            <div className="flex items-center w-auto sm:h-auto h-full gap-x-2 sm:mb-2 flex-wrap sm:grid sm:grid-cols-2">
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
            </div>
            <div className=" relative z-[0]">
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
        <div className=" sm:min-h-fit md:min-h-fit  grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-col-4 gap-2 content-center pb-1">
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
          <SelectInput
            options={options?.subSubjects?.map((i) => ({ label: i?.sub_subject_name, value: i?.sub_subject_id })) || []}
            placeholder="All Sub Subjects"
            displayName=""
            name="subSubjects"
            idName="subSubjectId"
            handleChange={(e) => {
              if (e !== null) {
                setSelectedValues({
                  ...selectedValues,
                  subSubjectId: e.value,
                });
              } else {
                setSelectedValues({
                  ...selectedValues,
                  subSubjectId: null,
                });
              }
            }}
            value={options?.subSubjects
              ?.map((i) => ({ label: i?.sub_subject_name, value: i.sub_subject_id }))
              ?.filter((i) => i?.value == selectedValues?.subSubjectId)}
            isClearable
            key={6}
          />
          <SelectInput
            options={options?.topics?.map((i) => ({ label: i?.topic_name, value: i?.topic_id })) || []}
            placeholder="All Topics"
            displayName=""
            name="topics"
            idName="topicId"
            handleChange={(e) => {
              if (e !== null) {
                setSelectedValues({
                  ...selectedValues,
                  topidId: e.value,
                });
              } else {
                setSelectedValues({
                  ...selectedValues,
                  topidId: null,
                });
              }
            }}
            value={options?.topics
              ?.map((i) => ({ label: i?.topic_name, value: i.topic_id }))
              ?.filter((i) => i?.value == selectedValues?.topidId)}
            isClearable
            key={7}
          />
          <SelectInput
            options={options?.subTopics?.map((i) => ({ label: i?.sub_topic_name, value: i?.sub_topic_id })) || []}
            placeholder="All Sub topics"
            displayName=""
            name="subTopics"
            idName="subtopicId"
            handleChange={(e) => {
              if (e !== null) {
                setSelectedValues({
                  ...selectedValues,
                  subtopicId: e.value,
                });
              } else {
                setSelectedValues({
                  ...selectedValues,
                  subtopicId: null,
                });
              }
            }}
            value={options?.subTopics
              ?.map((i) => ({ label: i?.sub_topic_name, value: i.sub_topic_id }))
              ?.filter((i) => i?.value == selectedValues?.subtopicId)}
            isClearable
            key={8}
          />
          <SelectInput
            options={options?.objectives?.map((i) => ({ label: i?.objective, value: i?.objective_id })) || []}
            placeholder="All Objective"
            displayName=""
            name="objectives"
            idName="objectiveId"
            handleChange={(e) => {
              if (e !== null) {
                setSelectedValues({
                  ...selectedValues,
                  objectiveId: e.value,
                });
              } else {
                setSelectedValues({
                  ...selectedValues,
                  objectiveId: null,
                });
              }
            }}
            value={options?.objectives
              ?.map((i) => ({ label: i?.objective, value: i.objective_id }))
              ?.filter((i) => i?.value == selectedValues?.objectiveId)}
            isClearable
            key={9}
          />
        </div>
        {studyCircleData.length ? (
          <Table
            paginate={paginate}
            count={count}
            limit={limit}
            currentPage={currentPage}
            offset={offset}
            studentData={studyCircleData}
            handleStudentRowClick={handleStudyCircleClick}
            columns={studyCircleSummaryCol}
            getMeColor={getMeColor}
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

export default StudyCircleSummary;
