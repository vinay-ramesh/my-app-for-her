import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { sideBarLayout } from '../../../layout/layout';
import secureLocalStorage from 'react-secure-storage';
import SelectInput from '../../../common/SelectInput/SelectInput';
import DateSelector from '../../../common/DateSelector/DateSelector';
import moment from 'moment';
import Table from '../../../common/Table/Table';
import { useDebounce } from '../../../../utils/customHooks/useDebounce';
import ImageAssets from '../../../../assets/imageAsset';
import promiseAllCall from '../../../../utils/promiseCallAll/promise';
import {
  fetchAssessmentModes,
  fetchAssesmentTypes,
  fetchOrganisersList,
  fetchStudyCirclesList,
  fetchSubjects,
} from '../../../../api/master_data';
import { fetchIndividualAcademicPeriod } from '../../../../api/academicPeriod';
import { assessmentSummaryColumns } from '../../../../utils/tableColumns/assessmentSummaryTableCol';
import { CONST_ALL_SPLIT } from '../../../../utils/Constants/constants';
import {
  fetchDayWiseAssessmentSummary,
  fetchMonthWiseAssessmentSummary,
  fetchYearWiseAssessmentSummary,
} from '../../../../api/assessmentSummary';
import { externalTooltipHandler } from '../../../../utils/ToolTip/tooltip';

const AssessmentSummary = () => {
  const assessmentSummarySelectedDropdownVals = JSON.parse(localStorage.getItem('assessmentSummarySelectedDropdownVals'));
  const selectedDatefromLocalStorage = localStorage?.getItem('selectedDate') || moment(new Date())?.format('YYYY-MM-DD');
  const selectedMode = localStorage.getItem('datemode');
  const navigate = useNavigate();

  const [options, setOptions] = useState({
    modes: [],
    assessments: [],
    organisers: [],
    studyCircles: [],
    subjects: [],
  });
  const [selectedValues, setSelectedValues] = useState({
    modeId: assessmentSummarySelectedDropdownVals?.modeId ? assessmentSummarySelectedDropdownVals?.modeId : CONST_ALL_SPLIT,
    assessmentId: assessmentSummarySelectedDropdownVals?.assessmentId
      ? assessmentSummarySelectedDropdownVals?.assessmentId
      : CONST_ALL_SPLIT,
    organiserId: assessmentSummarySelectedDropdownVals?.organiserId
      ? assessmentSummarySelectedDropdownVals?.organiserId
      : CONST_ALL_SPLIT,
    studyCircleId: assessmentSummarySelectedDropdownVals?.studyCircleId
      ? assessmentSummarySelectedDropdownVals?.studyCircleId
      : CONST_ALL_SPLIT,
    subjectId: assessmentSummarySelectedDropdownVals?.subjectId ? assessmentSummarySelectedDropdownVals?.subjectId : null,
    // : CONST_ALL_SPLIT,
    academicPeriodId: assessmentSummarySelectedDropdownVals?.academicPeriodId
      ? assessmentSummarySelectedDropdownVals?.academicPeriodId
      : null,
  });
  const [searchText, setSearchText] = useState('');
  const debounceValue = useDebounce(searchText);
  const [mode, setMode] = useState(selectedMode ? selectedMode : 'M');
  const [selectedDate, setSelectedDate] = useState(selectedDatefromLocalStorage);
  const [tableData, setTableData] = useState([]);
  const [assessmentData, setAssessmentData] = useState([]);
  const [count, setCount] = useState(0);

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
    localStorage.setItem('assessmentSummarySelectedDropdownVals', JSON.stringify(selectedValues));
    return () => {
      localStorage.removeItem('assessmentSummarySelectedDropdownVals');
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

  // search functionality
  // useEffect(() => {
  //   const getInstitutions = async () => {
  //     try {
  //       const listOfInstitutions = await fetchInstitutionList(userId, debounceValue);
  //       // console.log('listOfInstitutions', listOfInstitutions);
  //       if (listOfInstitutions?.length) {
  //         setInstitutionList(listOfInstitutions);
  //       } else {
  //         toast.info('No institutions found');
  //       }
  //     } catch (err) {
  //       console.log('err in fetching institution list', err);
  //     }
  //   };
  //   getInstitutions();
  // }, [debounceValue]);

  // fetch mode, assessment, organiser dropdowns with no dependency
  useEffect(() => {
    const fetchAll = async () => {
      const fetchDropdowns = await promiseAllCall([fetchAssessmentModes(), fetchAssesmentTypes(), fetchOrganisersList()]);
      // console.log('fetchDropdowns', fetchDropdowns, Array.isArray(fetchDropdowns[3]), !fetchDropdowns[3] instanceof Error);
      if (fetchDropdowns.length > 0) {
        if (fetchDropdowns[0] && Array.isArray(fetchDropdowns[0])) {
          setOptions((prevState) => {
            return {
              ...prevState,
              modes: fetchDropdowns[0],
            };
          });
        }
        if (fetchDropdowns[1] && Array.isArray(fetchDropdowns[1])) {
          setOptions((prevState) => {
            return {
              ...prevState,
              assessments: fetchDropdowns[1],
            };
          });
        }
        if (fetchDropdowns[2] && Array.isArray(fetchDropdowns[2])) {
          setOptions((prevState) => {
            return {
              ...prevState,
              organisers: fetchDropdowns[2],
            };
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
      //   console.log('selectedValues ', selectedValues);
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

  // get subjects
  useEffect(() => {
    const fetchDropdownDependencies = async () => {
      const fetchDependencyValues = await promiseAllCall([fetchSubjects(selectedValues.studyCircleId)]);

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
  }, [selectedValues.studyCircleId]);

  // fetch assessment summary data
  useEffect(() => {
    const fetchAssessmentData = async () => {
      const toastId = toast.loading('Fetching data!!');
      const modeIdList =
        selectedValues.modeId == CONST_ALL_SPLIT
          ? options?.modes
              .filter((ele) => ele.assessment_mode_id !== CONST_ALL_SPLIT)
              .map((ele) => ele.assessment_mode_id)
              .join(',')
          : `${selectedValues.modeId}`;

      const assessmentTypeIdList =
        selectedValues.assessmentId == CONST_ALL_SPLIT
          ? options?.assessments
              .filter((ele) => ele.assessment_type_id !== CONST_ALL_SPLIT)
              .map((ele) => ele.assessment_type_id)
              .join(',')
          : `${selectedValues.assessmentId}`;

      const organiserIdList =
        selectedValues.organiserId == CONST_ALL_SPLIT
          ? options?.organisers
              .filter((ele) => ele.organiser_type_id !== CONST_ALL_SPLIT)
              .map((ele) => ele.organiser_type_id)
              .join(',')
          : `${selectedValues.organiserId}`;

      const studyCircleIdList =
        selectedValues.studyCircleId == CONST_ALL_SPLIT
          ? options?.studyCircles
              .filter((ele) => ele.study_circle_id !== CONST_ALL_SPLIT)
              .map((ele) => ele.study_circle_id)
              .join(',')
          : `${selectedValues.studyCircleId}`;

      // const subjectIdList =
      //   selectedValues.subjectId == CONST_ALL_SPLIT
      //     ? options?.subjects
      //         .filter((ele) => ele.subject_id !== CONST_ALL_SPLIT)
      //         .map((ele) => ele.subject_id)
      //         .join(',')
      //     : `${selectedValues.subjectId}`;

      console.log('Id lists', {
        modeIdList,
        assessmentTypeIdList,
        organiserIdList,
        subjectId: selectedValues.subjectId,
        studyCircleIdList,
      });
      try {
        if (mode === 'D') {
          const assessmentRes = await fetchDayWiseAssessmentSummary(
            moment(selectedDate).format('YYYY-MM-DD'),
            studyCircleIdList,
            modeIdList,
            organiserIdList,
            assessmentTypeIdList,
            selectedValues.subjectId,
            selectedValues.academicPeriodId,
          );
          setTableData(assessmentRes);
          setCount(assessmentRes?.length);
          setOffset(0);
          setCurrentPage(1);
        }
        if (mode === 'M') {
          const presentYear = new Date(selectedDate).getFullYear();
          const presentMonth = new Date(selectedDate).getMonth();
          const date = new Date(presentYear, presentMonth, 1);
          const assessmentRes = await fetchMonthWiseAssessmentSummary(
            moment(date).format('YYYY-MM-DD'),
            studyCircleIdList,
            modeIdList,
            organiserIdList,
            assessmentTypeIdList,
            selectedValues.subjectId,
            selectedValues.academicPeriodId,
          );
          setTableData(assessmentRes);
          setCount(assessmentRes?.length);
          setOffset(0);
          setCurrentPage(1);
        }
        if (mode === 'Y') {
          const assessmentRes = await fetchYearWiseAssessmentSummary(
            selectedValues.academicPeriodId,
            studyCircleIdList,
            modeIdList,
            organiserIdList,
            assessmentTypeIdList,
            selectedValues.subjectId,
          );
          setTableData(assessmentRes);
          setCount(assessmentRes?.length);
          setOffset(0);
          setCurrentPage(1);
        }
        toast.success('Data loaded successfully', { id: toastId });
      } catch (err) {
        console.log('error in fetching student data', err);
        err?.code == 'ERR_CANCELED' ? toast.dismiss() : toast.error('Error in fetching Assessment data', { id: toastId });
      }
    };
    fetchAssessmentData();
    return () => {
      toast.dismiss();
    };
  }, [
    mode,
    selectedValues.academicPeriodId,
    selectedValues.studyCircleId,
    selectedValues.assessmentId,
    selectedValues.modeId,
    selectedValues.organiserId,
    selectedValues.subjectId,
    selectedDate,
    JSON.stringify(options.studyCircles),
    JSON.stringify(options.modes),
    JSON.stringify(options.assessments),
    JSON.stringify(options.organisers),
    JSON.stringify(options.subjects),
  ]);

  // paginate assessment data
  useEffect(() => {
    const startIndex = currentPage * limit - 10;
    const endIndex = currentPage * limit;
    const localData = [...tableData];
    const paginatedData = localData?.slice(startIndex, endIndex);
    // console.log('paginatedData', paginatedData);
    setAssessmentData(paginatedData);
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
          `Please select the dates between ${moment(academicStartDate).format(' MMM YYYY')} to ${moment(academicEndDate).format('DD MMM YYYY')}`,
        );
      }
    } else {
      setSelectedDate(dateSelected);
      localStorage.setItem('selectedDate', dateSelected);
    }
  };

  const handleAssessmentRowClick = (selectedRow) => {
    // const dropVal = {
    //   assessment_mode_id: selectedValues.modeId == -1 ? null : selectedValues.modeId,
    //   assessment_type_id: selectedValues.assessmentId == -1 ? null : selectedValues.assessmentId,
    //   assessment_organizer_id: selectedValues.organiserId == -1 ? null : selectedValues.organiserId,
    //   assessment_subject_id: selectedValues.subjectId == -1 ? null : selectedValues.subjectId,
    // };
    // window.localStorage.setItem('studyCircleFilterVal', JSON.stringify(dropVal));
    window.localStorage.setItem('datemode', mode);
    window.localStorage.setItem('selectedDate', selectedDate);
    window.localStorage.setItem('selectedAcadamicPeriod', JSON.stringify(selectedValues?.academicPeriodId));
    return navigate(`/assessments/assessmentdetails/${selectedRow?.assessment_id}?sc=${selectedRow?.study_circle_id}`, {
      state: tableData,
    });
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

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'left',
        title: {
          display: true,
        },
        labels: {
          boxWidth: 15,
          boxHeight: 15,
        },
      },
      tooltip: {
        enabled: false,
        position: 'nearest',
        external: externalTooltipHandler,
      },
    },
  };

  const chartDataFormat = (ele) => {
    return {
      labels: ['Correct', 'Near Correct', 'Incorrect', 'Not Answered'],
      datasets: [
        {
          label: 'Group',
          data: [
            ele.count_correct_responses,
            ele.count_near_correct_responses,
            ele.count_incorrect_responses,
            ele.count_not_answered_responses,
          ],
          backgroundColor: ['#0E9F6E', '#1C64F2', '#E02424', '#9CA3AF'],
        },
      ],
    };
  };

  return (
    <>
      <div className="w-full h-full sm:h-[700px] flex flex-col gap-y-2 overflow-auto">
        <div className="min-h-[7%] flex items-center justify-between w-full sm:block sm:min-h-fit md:min-h-fit md:flex-col md:items-baseline relative z-[1]">
          <div className="flex flex-wrap items-center justify-between sm:items-start w-full sm:h-auto h-full">
            {/* <div className="flex relative w-1/3 sm:w-full md:w-full">
              <input
                className="border border-gray-300 w-full h-11 rounded-lg pl-10 text-md focus:outline-none text-gray-900 placeholder:text-md"
                placeholder="Search"
                onChange={(e) => setSearchText(e.target.value)}
              />
              <div className="h-11 flex justify-around items-center absolute left-4">
                <img src={ImageAssets.search} alt="search-icon" />
              </div>
            </div> */}
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
            options={[
              { label: 'All Split (Mode)', value: CONST_ALL_SPLIT },
              ...(options?.modes?.map((i) => ({ label: i?.name, value: i?.assessment_mode_id })) || []),
            ]}
            placeholder="All Split (Mode)"
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
                  modeId: CONST_ALL_SPLIT,
                });
              }
            }}
            value={options?.modes
              ?.map((i) => ({ label: i?.name, value: i.assessment_mode_id }))
              ?.filter((i) => i?.value == selectedValues?.modeId)}
            // isClearable
            key={1}
          />
          <SelectInput
            options={[
              { label: 'All Split (Assessments Type)', value: CONST_ALL_SPLIT },
              ...(options?.assessments?.map((i) => ({ label: i?.name, value: i?.assessment_type_id })) || []),
            ]}
            placeholder="All Split (Assessments Type)"
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
                  assessmentId: CONST_ALL_SPLIT,
                });
              }
            }}
            value={options?.assessments
              ?.map((i) => ({ label: i?.name, value: i.assessment_type_id }))
              ?.filter((i) => i?.value === selectedValues?.assessmentId)}
            // isClearable
            key={2}
          />
          <SelectInput
            options={[
              { label: 'All Split (Organisers)', value: CONST_ALL_SPLIT },
              ...(options?.organisers?.map((i) => ({ label: i?.name, value: i?.organiser_type_id })) || []),
            ]}
            placeholder="All Split (Organisers)"
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
                  organiserId: CONST_ALL_SPLIT,
                });
              }
            }}
            value={options?.organisers
              ?.map((i) => ({ label: i?.name, value: i.organiser_type_id }))
              ?.filter((i) => i?.value === selectedValues?.organiserId)}
            // isClearable
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
                  subjectId: CONST_ALL_SPLIT,
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
            // isClearable
            key={5}
          />
        </div>
        {assessmentData.length ? (
          <Table
            paginate={paginate}
            count={count}
            limit={limit}
            currentPage={currentPage}
            offset={offset}
            studentData={assessmentData}
            handleStudentRowClick={handleAssessmentRowClick}
            columns={assessmentSummaryColumns}
            getMeColor={getMeColor}
            mode={mode}
            keyName="assessment_id"
            chartData={chartDataFormat}
            chartOptions={chartOptions}
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

export default AssessmentSummary;
