import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SelectInput from '../../../common/SelectInput/SelectInput';
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
import { Toaster, toast } from 'react-hot-toast';
import secureLocalStorage from 'react-secure-storage';
import Table from '../../../common/Table/Table';
import moment from 'moment';
import { sideBarLayout } from './../../../layout/layout';
import {
  fetchDayWiseStudentSummary,
  fetchMonthWiseStudentSummary,
  fetchYearWiseStudentSummary,
} from '../../../../api/studentsSummary';
import { GenerateHash } from '../../../../utils/GenerateHash/GenerateHash';
import { fetchIndividualAcademicPeriod } from '../../../../api/academicPeriod';
import { studentSummaryColumns } from '../../../../utils/tableColumns/studentSummaryTableCol';
import DateSelector from '../../../common/DateSelector/DateSelector';
import ImageAssets from '../../../../assets/imageAsset';

const StudentsSummary = () => {
  const selectedDropdownValues = JSON.parse(localStorage.getItem('selectedDropdownValues'));
  const selectedDatefromLocalStorage = localStorage?.getItem('selectedDate')
    ? localStorage?.getItem('selectedDate')
    : moment(new Date())?.format('YYYY-MM-DD');
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
    modeId: selectedDropdownValues?.modeId ? selectedDropdownValues.modeId : -1,
    assessmentId: selectedDropdownValues?.assessmentId ? selectedDropdownValues.assessmentId : -1,
    organiserId: selectedDropdownValues?.organiserId ? selectedDropdownValues.organiserId : -1,
    studyCircleId: selectedDropdownValues?.studyCircleId ? selectedDropdownValues.studyCircleId : -1,
    subjectId: selectedDropdownValues?.subjectId ? selectedDropdownValues.subjectId : -1,
    subSubjectId: selectedDropdownValues?.subSubjectId ? selectedDropdownValues.subSubjectId : -1,
    topidId: selectedDropdownValues?.topidId ? selectedDropdownValues.topidId : -1,
    subtopicId: selectedDropdownValues?.subtopicId ? selectedDropdownValues.subtopicId : -1,
    academicPeriodId: selectedDropdownValues?.academicPeriodId ? selectedDropdownValues?.academicPeriodId : -1,
    objectiveId: selectedDropdownValues?.objectiveId ? selectedDropdownValues.objectiveId : -1,
  });
  const [selectedDate, setSelectedDate] = useState(selectedDatefromLocalStorage);
  const [showMonths, setShowMonths] = useState(false);
  const [presentYear, setPresentYear] = useState(new Date(selectedDate).getFullYear());
  const [hashValue, setHashValue] = useState('');
  const [tableData, setTableData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [count, setCount] = useState(0);
  const [mode, setMode] = useState(selectedMode ? selectedMode : 'M');

  const contextValues = useContext(sideBarLayout);
  // console.log('contextValues', contextValues);
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

  // fetch mode, assessment, organiser dropdows with no dependency
  useEffect(() => {
    // console.log('I am coming fetchAll1');
    const fetchAll = async () => {
      const fetchDropdowns = await promiseAllCall([fetchAssessmentModes(), fetchAssesmentTypes(), fetchOrganisersList()]);
      // console.log('fetchDropdowns', fetchDropdowns, Array.isArray(fetchDropdowns[3]), !fetchDropdowns[3] instanceof Error);
      if (fetchDropdowns.length > 0) {
        if (fetchDropdowns[0] && Array.isArray(fetchDropdowns[0])) {
          setOptions((prevState) => {
            return { ...prevState, modes: fetchDropdowns[0] };
          });
        }
        if (fetchDropdowns[1] && Array.isArray(fetchDropdowns[1])) {
          setOptions((prevState) => {
            return { ...prevState, assessments: fetchDropdowns[1] };
          });
        }
        if (fetchDropdowns[2] && Array.isArray(fetchDropdowns[2])) {
          setOptions((prevState) => {
            return { ...prevState, organisers: fetchDropdowns[2] };
          });
        }
      } else {
        toast.info('No dropdown values found for Mode, Assessments, Organisers', { duration: 2000 });
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
          toast.error('No Study Circles found for selected board', { duration: 2000 });
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
      try {
        const studyCircles = await fetchStudyCirclesList(institutionId, boardId, selectedValues.academicPeriodId);
        // console.log('studyCircles', studyCircles);
        setOptions((prevState) => {
          return { ...prevState, studyCircles: studyCircles };
        });
      } catch (err) {
        console.log('error in fetching study cirlces list', err);
        toast.error('Error in fetching study circles list');
      }
    };
    fetchStudyCirles();
  }, [boardId, selectedValues.academicPeriodId]);

  // store the selected dropdown dependencies
  useEffect(() => {
    // console.log('I am coming fetchDropdownDependencies3');
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

      console.log('fetchDependencyValues', fetchDependencyValues, selectedValues.subjectId);
      if (fetchDependencyValues.length > 0) {
        if (fetchDependencyValues[0] && Array.isArray(fetchDependencyValues[0])) {
          setOptions((prevState) => {
            return { ...prevState, subjects: fetchDependencyValues[0] };
          });
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
        // console.log(fetchDependencyValues, Array.isArray(fetchDependencyValues[4]), 'fetchDependencyValues');
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
        toast.info('No dropdown values found', { duration: 2000 });
      }
    };
    try {
      fetchDropdownDependencies();
    } catch (err) {
      console.log('Error in fetching dropdown values', err);
      toast.error('Error in fetching dependency dropdowns', { duration: 2000 });
    }
  }, [
    selectedValues.studyCircleId,
    selectedValues.subjectId,
    selectedValues.subSubjectId,
    selectedValues.topidId,
    selectedValues.subtopicId,
  ]);

  // update localStorage
  useEffect(() => {
    localStorage.setItem('selectedDropdownValues', JSON.stringify(selectedValues));
    // return () => {
    //   localStorage.removeItem('selectedDropdownValues');
    // };
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
  ]);

  // generate hash
  useEffect(() => {
    // console.log('I am coming GenerateHash4');
    const dropdownValues = {
      assessment_mode_id: selectedValues.modeId == -1 ? null : selectedValues.modeId,
      assessment_type_id: selectedValues.assessmentId == -1 ? null : selectedValues.assessmentId,
      assessment_organizer_id: selectedValues.organiserId == -1 ? null : selectedValues.organiserId,
      assessment_subject_id: selectedValues.subjectId == -1 ? null : selectedValues.subjectId,
      question_sub_subject_id: selectedValues.subSubjectId == -1 ? null : selectedValues.subSubjectId,
      question_topic_id: selectedValues.topidId == -1 ? null : selectedValues.topidId,
      question_sub_topic_id: selectedValues.subtopicId == -1 ? null : selectedValues.subtopicId,
      question_object: selectedValues.objectiveId == -1 ? null : selectedValues.objectiveId,
    };
    const hashedValue = GenerateHash(dropdownValues);
    setHashValue(hashedValue);
  }, [
    selectedValues.modeId,
    selectedValues.assessmentId,
    selectedValues.objectiveId,
    selectedValues.organiserId,
    selectedValues.subSubjectId,
    selectedValues.subjectId,
    selectedValues.topidId,
    selectedValues.subtopicId,
    selectedValues.objectiveId,
  ]);

  // fetch student data
  useEffect(() => {
    const fetchStudentData = async () => {
      const toastId = toast.loading('Fetching data!!');
      try {
        if (mode === 'D' && hashValue?.length > 0) {
          if (selectedValues.studyCircleId == -1) {
            const studyCircleIdString = options.studyCircles?.map((ele) => ele?.study_circle_id).join(',');
            if (studyCircleIdString) {
              const studentData = await fetchDayWiseStudentSummary(
                moment(selectedDate).format('YYYY-MM-DD'),
                studyCircleIdString,
                hashValue,
              );
              setTableData(studentData);
              setCount(studentData?.length);
            }
          } else {
            const studentData = await fetchDayWiseStudentSummary(
              moment(selectedDate).format('YYYY-MM-DD'),
              selectedValues.studyCircleId,
              hashValue,
            );
            setTableData(studentData);
            setCount(studentData?.length);
          }
        }
        if (mode === 'M' && hashValue.length > 0) {
          const presentYear = new Date(selectedDate).getFullYear();
          const presentMonth = new Date(selectedDate).getMonth();
          const date = new Date(presentYear, presentMonth, 1);
          if (selectedValues.studyCircleId == -1) {
            const studyCircleIdString = options.studyCircles?.map((ele) => ele?.study_circle_id).join(',');
            if (studyCircleIdString) {
              const studentData = await fetchMonthWiseStudentSummary(
                moment(date).format('YYYY-MM-DD'),
                studyCircleIdString,
                hashValue,
              );
              setTableData(studentData);
              setCount(studentData?.length);
              setOffset(0);
              setCurrentPage(1);
            }
          } else {
            const studentData = await fetchMonthWiseStudentSummary(
              moment(date).format('YYYY-MM-DD'),
              selectedValues.studyCircleId,
              hashValue,
            );
            setTableData(studentData);
            setCount(studentData?.length);
            setOffset(0);
            setCurrentPage(1);
          }
        }
        if (mode === 'Y' && hashValue?.length > 0) {
          if (selectedValues.studyCircleId == -1) {
            const studyCircleIdString = options.studyCircles?.map((ele) => ele?.study_circle_id).join(',');
            if (studyCircleIdString) {
              const studentData = await fetchYearWiseStudentSummary(
                selectedValues.academicPeriodId,
                studyCircleIdString,
                hashValue,
              );
              setTableData(studentData);
              setCount(studentData?.length);
              setOffset(0);
              setCurrentPage(1);
            }
          } else {
            const studentData = await fetchYearWiseStudentSummary(
              selectedValues.academicPeriodId,
              selectedValues.studyCircleId,
              hashValue,
            );
            setTableData(studentData);
            setCount(studentData?.length);
            setOffset(0);
            setCurrentPage(1);
          }
        }
        toast.success('Data fetched successfully', { id: toastId });
      } catch (err) {
        console.log('error in fetching student data', err, err?.message);
        err?.code == 'ERR_CANCELED' ? toast.dismiss() : toast.error('Error in fetching student data', { id: toastId });
      }
    };
    hashValue?.length > 0 && fetchStudentData();
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

  // paginate student data
  useEffect(() => {
    const startIndex = currentPage * limit - 10;
    const endIndex = currentPage * limit;
    const localData = [...tableData];
    const paginatedData = localData?.slice(startIndex, endIndex);
    // console.log('paginatedData', paginatedData);
    setStudentData(paginatedData);
  }, [offset, currentPage, JSON.stringify(tableData)]);

  const handleChange = (dateSelected) => {
    if (mode.isMonth && !(dateSelected instanceof Date)) {
      const date = new Date(presentYear, dateSelected, 1);

      const checkMinDate = new Date(moment(academicStartDate).format('YYYY-MM-DD')) <= new Date(moment(date).format('YYYY-MM-DD'));
      const checkMaxDate = new Date(moment(academicEndDate).format('YYYY-MM-DD')) >= new Date(moment(date).format('YYYY-MM-DD'));

      console.log('dateSelected', {
        dateSelected: moment(date).format('YYYY-MM-DD'),
        academicEndDate,
        academicStartDate,
        checkMaxDate,
        checkMinDate,
      });
      if (checkMaxDate && checkMinDate) {
        setSelectedDate(date);
        localStorage.setItem('selectedDate', date, typeof date);
        setShowMonths(false);
      } else {
        toast.error(
          `Please select the dates between ${moment(academicStartDate).format(' MMM YYYY')} to ${moment(academicEndDate).format('DD MMM YYYY')}`,
        );
      }
    } else {
      setSelectedDate(dateSelected);
      localStorage.setItem('selectedDate', dateSelected);
      setShowMonths(false);
    }
  };

  const handleStudentRowClick = (selectedRow) => {
    const dropVal = {
      assessment_mode_id: selectedValues.modeId == -1 ? null : selectedValues.modeId,
      assessment_type_id: selectedValues.assessmentId == -1 ? null : selectedValues.assessmentId,
      assessment_organizer_id: selectedValues.organiserId == -1 ? null : selectedValues.organiserId,
      assessment_subject_id: selectedValues.subjectId == -1 ? null : selectedValues.subjectId,
      question_sub_subject_id: selectedValues.subSubjectId == -1 ? null : selectedValues.subSubjectId,
      question_topic_id: selectedValues.topidId == -1 ? null : selectedValues.topidId,
      question_sub_topic_id: selectedValues.subtopicId == -1 ? null : selectedValues.subtopicId,
      question_object: selectedValues.objectiveId == -1 ? null : selectedValues.objectiveId,
    };
    window.localStorage.setItem('stdDetailsfilterval', JSON.stringify(dropVal));
    window.localStorage.setItem('datemode', mode);
    window.localStorage.setItem('selectedDate', selectedDate);
    window.localStorage.setItem('selectedAcadamicPeriod', JSON.stringify(selectedValues?.academicPeriodId));
    contextValues.setBreadCrumbName(selectedRow?.student_name?.toLowerCase() || '');

    return navigate(`/students/studentdetails/${selectedRow.student_id}`, { state: selectedRow });
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
      <div className=" w-full h-full sm:h-[900px] flex flex-col gap-y-2 overflow-auto">
        <div className="min-h-[7%] flex items-center justify-between w-full sm:block sm:min-h-fit md:min-h-fit md:flex-col md:items-baseline relative z-[1]">
          <div className="flex text-gray-600 tracking-wide sm:ml-4 items-center w-auto sm:h-auto h-full gap-x-0 text-sm sm:text-sm md:text-md lg:text-md xl:text-lg 2xl:text-xl sm:mb-2">
            <h3 className=" font-semibold">Total</h3>: <div className="ml-2"> {tableData?.length ?? 0}</div>
          </div>
          <div className="sm:flex sm:justify-center ">
            <DateSelector
              mode={mode}
              setMode={(e) => {
                setMode(e);
              }}
              selectedDate={selectedDate}
              handleChange={(e) => {
                handleChange(e);
              }}
              setSelectedValues={(e) => {
                setSelectedValues((prevState) => ({ ...prevState, academicPeriodId: e }));
              }}
              academic_period_id={selectedValues?.academicPeriodId}
            />
          </div>
        </div>
        <div className=" sm:min-h-fit md:min-h-fit  grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-col-4 gap-2 content-center pb-1">
          <SelectInput
            options={options?.modes?.map((i) => ({ label: i?.name, value: i?.assessment_mode_id })) || []}
            placeholder="All Mode"
            name="mode"
            idName="modeId"
            handleChange={(e) => {
              if (e !== null) {
                setSelectedValues({
                  ...selectedValues,
                  modeId: e.value,
                });
              } else {
                setSelectedValues({
                  ...selectedValues,
                  modeId: -1,
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
                  assessmentId: -1,
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
                  organiserId: -1,
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
            options={options?.studyCircles?.map((i) => ({ label: i?.sc_name, value: i?.study_circle_id })) || []}
            placeholder="All Study Circles"
            displayName=""
            name="studyCircles"
            idName="studyCircleId"
            handleChange={(e) => {
              if (e !== null) {
                setSelectedValues({
                  ...selectedValues,
                  studyCircleId: e.value,
                });
              } else {
                setSelectedValues({
                  ...selectedValues,
                  studyCircleId: -1,
                });
              }
            }}
            value={options?.studyCircles
              ?.map((i) => ({ label: i?.sc_name, value: i.study_circle_id }))
              ?.filter((i) => i?.value === selectedValues?.studyCircleId)}
            isClearable
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
                  subjectId: -1,
                });
              }
            }}
            value={options?.subjects
              ?.map((i) => ({ label: i?.subject, value: i.subject_id }))
              ?.filter((i) => i?.value === selectedValues?.subjectId)}
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
                  subSubjectId: -1,
                });
              }
            }}
            value={options?.organisers
              ?.map((i) => ({ label: i?.sub_subject_name, value: i.sub_subject_id }))
              ?.filter((i) => i?.value === selectedValues?.subSubjectId)}
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
                  topidId: -1,
                });
              }
            }}
            value={options?.organisers
              ?.map((i) => ({ label: i?.topic_name, value: i.topic_id }))
              ?.filter((i) => i?.value === selectedValues?.topidId)}
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
                  subtopicId: -1,
                });
              }
            }}
            value={options?.subTopics
              ?.map((i) => ({ label: i?.sub_topic_name, value: i.sub_topic_id }))
              ?.filter((i) => i?.value === selectedValues?.subtopicId)}
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
                  objectiveId: -1,
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
        {studentData.length ? (
          <Table
            paginate={paginate}
            count={count}
            limit={limit}
            currentPage={currentPage}
            offset={offset}
            studentData={studentData}
            handleStudentRowClick={handleStudentRowClick}
            columns={studentSummaryColumns}
            getMeColor={getMeColor}
            keyName="student_id"
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

export default StudentsSummary;
