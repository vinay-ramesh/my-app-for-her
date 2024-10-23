import React, { useEffect, useState, useCallback, useContext } from 'react';

import StudyCircleProfile from '../../../Application/StudyCIrcleDetails/StudyCircleProfile/StudyCircleProfile';
import PerformanceMetrics from '../../../Application/StudyCIrcleDetails/PerformanceMetrics/PerformanceMetrics';
import SubFilters from '../../../Application/StudyCIrcleDetails/SubFilters/SubFilters';
import ReadVelocity from '../../../Application/StudyCIrcleDetails/ReadVelocity/ReadVelocity';
import Trend from '../../../common/Trend/Trend';
import { GenerateHash } from '../../../../utils/GenerateHash/GenerateHash';
import moment from 'moment';
import { sideBarLayout } from '../../../layout/layout';
import DateSelector from '../../../common/DateSelector/DateSelector';
import secureLocalStorage from 'react-secure-storage';
import {
  fetchAssessmentModes,
  fetchAssesmentTypes,
  fetchOrganisersList,
  fetchSubjects,
  fetchSubSubject,
  fetchTopic,
  fetchSubTopic,
  fetchObjectives,
} from '../../../../api/master_data';
import {
  getAllTrendDetails,
  getMonthAllTrendDetails,
  getYearAllTrendDetails,
  getStudyCircleVelocity,
  getMonthStudyCircleVelocity,
  getYearStudyCircleVelocity,
} from '../../../../api/StudyCircleDetails';

import toast, { Toaster } from 'react-hot-toast';
import ImageAssets from '../../../../assets/imageAsset';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { combineArrays } from '../../../../utils/GenerateHash/GenerateCombination';
import NoDataFound from '../../../Application/AssessmentDetails/QuestionDetails/Questions/QuestionDetailsChild/QuestionNoData/QuestionNoData';

// Component to display a specific set of values with a trend icon
export const DisplayValues = ({ title, mainValue, mainTrend, avgTitle, avgValue }) => {
  return (
    <div className="sm:flex sm:items-start md:flex md:items-start ">
      <div>
        <div className=" text-sm font-semibold text-gray-600">{title}</div>
        <div className=" flex items-center gap-3 text-xl text-gray-900 font-bold">
          {mainValue || 0}
          <img className="w-4 h-4" src={mainTrend === 'up' ? ImageAssets.Green_Arrow : ImageAssets?.Red_Arrow} alt="" />
        </div>
      </div>
      <div className="mt-4">
        <div className=" text-sm font-medium text-gray-900">{avgValue || 0}</div>
        <div className="text-xs font-medium text-gray-400">{avgTitle}</div>
      </div>
    </div>
  );
};

const readVelocityConstantMultiply = process.env.VITE_CONSTANT_READ_VELOCITY_MAX;

const BUTTON_VELOCITY_INDEX = 1;
const BUTTON_SCORE_INDEX = 2;
const BUTTON_ACCURACY_INDEX = 3;
const GRAPH_MAX_VALUE = 100;
const GRAPH_STEP_VALUE = 1;

const StudyCircleDetails = () => {
  // Initilizing router parameters
  const location = useLocation();
  const params = useParams();
  const [searchParams] = useSearchParams();
  console.log(params, location, localStorage?.getItem('selectedDate'), 'location');
  const contextValues = useContext(sideBarLayout);
  // State to manage student performance data
  const [studyCirclestudentPerformance, setStudyCirclestudentPerformance] = useState([]);
  // State to manage student trend data
  const [studentTrend, setStudentTrend] = useState([]);
  // State to manage the date mode (daily, monthly, yearly)
  const [dateMode, setDateMode] = useState('M');
  // State to store student details
  const [studyCircleDetails, setStudyCircleDetails] = useState({
    studentId: '',
    studentName: '',
    studyCircleName: '',
    studyCircleId: +params?.id,
    assessmentDate: moment(localStorage?.getItem('selectedDate'))?.format('YYYY-MM-DD'),
    institutionId: secureLocalStorage.getItem('cmn_school_id'),
  });
  // State to  manage dropdown values
  const [dropdownValues, setDropDownValues] = useState({
    assessment_mode: [],
    assessment_type: [],
    assessment_organizer: [],
    assessment_subject: [],
    question_sub_subject: [],
    question_topic: [],
    question_sub_topic: [],
    question_objective: [],
  });
  // State to manage selected values from dropdowns
  const [selectedValues, setSelectedValues] = useState({
    assessment_mode_id: null,
    assessment_type_id: null,
    assessment_organizer_id: null,
    assessment_subject_id: null,
    question_sub_subject_id: null,
    question_topic_id: null,
    question_sub_topic_id: null,
    question_objective_id: null,
  });
  const [datePickerValue, setDatePickerValue] = useState(new Date(localStorage?.getItem('selectedDate')));
  const [academic_period_id, setAcademic_period_id] = useState(localStorage.getItem('selectedAcadamicPeriod'));
  const [noDataFound, setNoDataFound] = useState({
    performanceData: false,
    readVelocityData: false,
  });
  console.log(selectedValues, studyCircleDetails, studyCirclestudentPerformance, studentTrend, 'selectedValues');

  // useEffect to fetch dropdown values when the component loads
  useEffect(() => {
    //
    // Cleanup function
    return () => {
      console.log('Component unmounted, cleaning up...');

      // Cleanup example: clear localStorage or reset states if needed

      setStudyCirclestudentPerformance([]);
      setStudentTrend([]);
      toast.dismiss();
    };
  }, [location]);
  useEffect(() => {
    getIndependentDropdownValue();
    contextValues.setBreadCrumbName(location?.state?.study_circle_name?.toLowerCase() || '');
    // setting StudentDetails From Parms State
    setStudyCircleDetails((pre) => ({
      ...pre,
      // studyCircleId: location?.state?.study_circle_id || 28329,
      studentId: location?.state?.student_id || null,
      studentName: location?.state?.student_name || null,
      studyCircleName: location?.state?.study_circle_name,
      assessmentDate: moment(localStorage?.getItem('selectedDate'))?.format('YYYY-MM-DD'),
    }));
    setDatePickerValue(new Date(localStorage?.getItem('selectedDate')));

    let mode = localStorage?.getItem('datemode');

    if (mode) {
      setDateMode(mode);
    } else {
      setDateMode('M');
    }

    const dropVal = JSON.parse(localStorage?.getItem('studyCircleFilterVal'));

    console.log(dropVal, 'locations');
    if (searchParams.get('redirected')) {
      console.log('location IF-----');

      const dropdownHandlers = {
        assessment_subject_id: 'assessment_subject_id',
        question_sub_subject_id: 'question_sub_subject_id',
        question_topic_id: 'question_topic_id',
        question_sub_topic_id: 'question_sub_topic_id',
        question_objective_id: 'question_objective_id',
      };

      for (let key in dropdownHandlers) {
        setSelectedValues(dropVal);
        console.log(key, dropVal?.[key], dropdownHandlers[key], selectedValues, 'forLoop');
        if (dropVal?.[key] && dropdownHandlers[key]) {
          handleDropdownValues(dropVal?.[key], dropdownHandlers[key], dropVal?.assessment_subject_id);
        }
      }

      console.log(selectedValues, dropdownValues, 'student---');
    } else {
      console.log('locations IF-----');
      const dropdownHandlers = {
        assessment_subject_id: 'assessment_subject_id',
        question_sub_subject_id: 'question_sub_subject_id',
        question_topic_id: 'question_topic_id',
      };

      for (let key in dropVal) {
        if (dropVal?.[key] && dropdownHandlers[key]) {
          handleDropdownValues(dropVal?.[key], dropdownHandlers[key], dropVal?.assessment_subject_id);
        }
      }

      if (dropVal) {
        setSelectedValues(dropVal);
      }

      const locationValue = location?.state;

      if (locationValue) {
        setSelectedValues((pre) => ({
          ...pre,
          assessment_mode_id: locationValue?.assessment_mode_id || null,
          assessment_organizer_id: locationValue?.assessment_organizer_id || null,
          assessment_type_id: locationValue?.assessment_type_id || null,
          assessment_subject_id: locationValue?.subject_id || null,
        }));

        if (locationValue?.assessment_subject_id) {
          handleDropdownValues(locationValue?.assessment_subject_id || null, 'assessment_subject_id');
        }
      }
    }
  }, [location]);

  // Handler for updating student details
  const handleStudentsDetails = useCallback((name, value) => {
    setStudyCircleDetails((pre) => ({ ...pre, [name]: value }));
  }, []);

  // Function to fetch independent dropdown values
  const getIndependentDropdownValue = useCallback(async () => {
    try {
      const results = await Promise.allSettled([
        fetchSubjects(studyCircleDetails?.studyCircleId),
        fetchAssessmentModes(),
        fetchAssesmentTypes(),
        fetchOrganisersList(),
        fetchObjectives(selectedValues?.assessment_subject_id),
      ]);
      console.log(results, 'dropdownValues');
      const [res, modeRes, typeRes, organizerRes, objectiveRes] = results.map((result) =>
        result.status === 'fulfilled' ? result.value : null,
      );
      const err = results.filter((i) => i.status === 'rejected');
      if (err?.length) {
        console.error(err, 'Api Error');
        toast.error('Something went Wrong: Look at Console Errors for Details');
      }

      console.log(res, modeRes, typeRes, organizerRes, objectiveRes, 'modeRes');
      setDropDownValues((prev) => ({
        ...prev,
        assessment_mode: modeRes || [],
        assessment_subject: res || [],
        assessment_type: typeRes || [],
        assessment_organizer: organizerRes || [],
        question_objective: objectiveRes || [],
      }));
    } catch (error) {
      console.log('Error fetching:', error);
    }
  }, []);

  // Handler for fetching dropdown values based on selected values
  const handleDropdownValues = useCallback(
    async (value, name, subject_id) => {
      const toastId = toast.loading('Please wait, loading...');

      // Map dropdown reset behavior based on the selected dropdown
      const resetFields = {
        assessment_mode_id: [
          'assessment_type_id',
          'assessment_organizer_id',
          'assessment_subject_id',
          'question_sub_subject_id',
          'question_topic_id',
          'question_sub_topic_id',
          'question_objective_id',
        ],
        assessment_type_id: [
          'assessment_organizer_id',
          'assessment_subject_id',
          'question_sub_subject_id',
          'question_topic_id',
          'question_sub_topic_id',
          'question_objective_id',
        ],
        organiser_type_id: [
          'assessment_subject_id',
          'question_sub_subject_id',
          'question_topic_id',
          'question_sub_topic_id',
          'question_objective_id',
        ],
        assessment_subject_id: ['question_sub_subject_id', 'question_topic_id', 'question_sub_topic_id', 'question_objective_id'],
        question_sub_subject_id: ['question_topic_id', 'question_sub_topic_id', 'question_objective_id'],
        question_topic_id: ['question_sub_topic_id', 'question_objective_id'],
        question_sub_topic_id: ['question_objective_id'],
      };

      // Update selected values with dynamic field resets
      const resetSelectedValues = (resetKeys) => {
        const updatedValues = resetKeys.reduce((acc, key) => ({ ...acc, [key]: null }), {});
        setSelectedValues((prev) => ({ ...prev, [name]: value, ...updatedValues }));
      };

      resetSelectedValues(resetFields[name] || []);

      try {
        switch (name) {
          case 'assessment_subject_id': {
            if (value) {
              console.log(studyCircleDetails, secureLocalStorage.getItem('cmn_school_id'), 'sbject_id');
              const res = await Promise.allSettled([
                fetchSubSubject(studyCircleDetails?.institutionId, value),
                fetchTopic(studyCircleDetails?.institutionId, value),
                fetchObjectives(value),
              ]);
              console.log(res, 'dropdownValues');
              const [subSubjectRes, topicRes, objectiveRes] = res.map((result) =>
                result.status === 'fulfilled' ? result.value : null,
              );
              const err = res.filter((i) => i.status === 'rejected');
              if (err?.length) {
                console.error(err, 'Api Error');
                toast.error('Something went Wrong: Look at Console Errors for Details');
              }
              setDropDownValues((prev) => ({
                ...prev,
                question_sub_subject: subSubjectRes || [],
                question_topic: topicRes || [],
                question_sub_topic: [],
                question_objective: objectiveRes || [],
              }));
            } else {
              const res = await fetchObjectives();
              console.log(res, 'dropdownValues');
              setDropDownValues((prev) => ({
                ...prev,
                question_sub_subject: [],
                question_topic: [],
                question_sub_topic: [],
                question_objective: res || [],
              }));
            }
            break;
          }
          case 'question_sub_subject_id': {
            const topicRes = await fetchTopic(
              studyCircleDetails?.institutionId,
              selectedValues?.assessment_subject_id || subject_id,
              value,
            );

            setDropDownValues((prev) => ({
              ...prev,
              question_topic: topicRes || [],
              question_sub_topic: [],
            }));
            break;
          }
          case 'question_topic_id': {
            const subTopicRes = await fetchSubTopic(
              studyCircleDetails?.institutionId,
              selectedValues?.assessment_subject_id,
              selectedValues?.question_sub_subject_id,
              value,
            );

            setDropDownValues((prev) => ({
              ...prev,
              question_sub_topic: subTopicRes || [],
            }));
            break;
          }
          case 'question_sub_topic_id': {
            break;
          }
          default:
            break;
        }

        toast.success('Details fetched successfully', { id: toastId });
      } catch (error) {
        console.error('Error fetching dropdown values:', error);
        if (error?.message !== 'canceled') {
          toast.error('Error fetching data', { id: toastId });
        } else {
          toast.dismiss(toastId);
        }
      }
    },
    [studyCircleDetails, selectedValues],
  );

  const generateListHash = (e, subjects) => {
    const hashinput = {
      assessment_mode_id: [e?.assessment_mode_id],
      assessment_type_id: [e.assessment_type_id],
      assessment_organizer_id: [e.assessment_organizer_id],
      assessment_subject_id: [null, ...subjects?.map((i) => i.subject_id)],
      question_sub_subject_id: [null],
      question_topic_id: [null],
      question_sub_topic_id: [null],
      question_objective_id: [null],
    };
    console.log(hashinput, 'location--');
    const combiResult = combineArrays(hashinput);
    console.log(hashinput, combiResult, combiResult.map((item) => `'${item}'`).join(', '), 'hashinput');
    return combiResult
      .map((item) => `'${item}'`)
      .join(',')
      ?.slice(1, -1);
  };

  const allPerformanceData = async () => {
    const toastId = toast.loading('Please Wait Loading....');
    setNoDataFound({
      performanceData: false,
      readVelocityData: false,
    });
    let res = [];
    let trendRes = [];
    try {
      if (dateMode === 'D') {
        res = await getAllTrendDetails(
          studyCircleDetails?.assessmentDate,
          studyCircleDetails?.studyCircleId,
          GenerateHash(selectedValues),
        );
        trendRes = await getStudyCircleVelocity(
          studyCircleDetails?.assessmentDate,
          studyCircleDetails?.studyCircleId,

          generateListHash(selectedValues, dropdownValues?.assessment_subject),
        );
      } else if (dateMode === 'M') {
        res = await getMonthAllTrendDetails(
          studyCircleDetails?.assessmentDate,

          studyCircleDetails?.studyCircleId,
          GenerateHash(selectedValues),
        );
        trendRes = await getMonthStudyCircleVelocity(
          studyCircleDetails?.assessmentDate,
          studyCircleDetails?.studyCircleId,
          generateListHash(selectedValues, dropdownValues?.assessment_subject),
        );
      } else if (dateMode === 'Y') {
        res = await getYearAllTrendDetails(
          Number(academic_period_id),
          studyCircleDetails?.studyCircleId,
          GenerateHash(selectedValues),
        );
        trendRes = await getYearStudyCircleVelocity(
          Number(academic_period_id),
          studyCircleDetails?.studyCircleId,
          generateListHash(selectedValues, dropdownValues?.assessment_subject),
        );
      }
      setStudentTrend(trendRes?.data?.data || []);
      if (!trendRes?.data?.data?.length) {
        setNoDataFound((pre) => ({
          ...pre,
          readVelocityData: true,
        }));
      } else {
        if (!trendRes?.data?.data?.filter((i) => i.avg_response_velocity)?.length) {
          setNoDataFound((pre) => ({
            ...pre,
            readVelocityData: true,
          }));
        }
      }
      setStudyCirclestudentPerformance(res?.data?.data || []);
      if (!res?.data?.data?.avg_response_velocity) {
        setNoDataFound((pre) => ({
          ...pre,
          performanceData: true,
        }));
      }
      toast.success('Details Fetched', {
        id: toastId,
      });
    } catch (error) {
      toast.success('Error', {
        id: toastId,
      });
      console.log(error);
    }
  };

  // useEffect to fetch dropdown values when the component loads
  useEffect(() => {
    localStorage.setItem('studyCircleFilterVal', JSON.stringify(selectedValues));
    console.log(selectedValues, 'locations');
    if (studyCircleDetails?.studyCircleId > 0 && dropdownValues?.assessment_subject?.length > 0) allPerformanceData();
  }, [selectedValues, studyCircleDetails?.assessmentDate, dropdownValues?.assessment_subject, dateMode]);

  useEffect(() => {
    console.log(studyCircleDetails?.assessmentDate, 'assesment date');
  }, [studyCircleDetails]);
  const buttonData = [
    {
      title: 'Group Percentile',
      name: 'percentile_gsc',
      isMultiply: false,
      variable: studyCirclestudentPerformance?.window_measures_history,
    },

    {
      title: 'Velocity',
      name: 'sum_response_velocity',
      isMultiply: true,
      variable: studyCirclestudentPerformance?.measures_history,
    },
    {
      title: 'Score',
      name: 'sum_response_main_score',
      isMultiply: true,
      variable: studyCirclestudentPerformance?.measures_history,
    },
    {
      title: 'Accuracy',
      name: 'sum_response_accuracy_score',
      isMultiply: true,
      variable: studyCirclestudentPerformance?.measures_history,
    },
  ];
  const academicPeriods = contextValues?.academicPeriodList;
  useEffect(() => {
    const academicPeriodId = getAcademicPeriodIdByDate(academicPeriods, studyCircleDetails?.assessmentDate);
    setAcademic_period_id(academicPeriodId);
    localStorage.setItem('selectedAcadamicPeriod', academicPeriodId);
  }, [studyCircleDetails?.assessmentDate, dateMode, academicPeriods]);
  function getAcademicPeriodIdByDate(academicPeriods, selectedDate) {
    const date = new Date(selectedDate);
    const foundPeriod = academicPeriods.find((period) => {
      const startDate = new Date(period.start_date);
      const endDate = new Date(period.end_date);
      return date >= startDate && date <= endDate;
    });
    return foundPeriod ? foundPeriod.academic_period_id : null;
  }

  const [activeButton, setActiveButton] = useState(0);
  const handleActiveButton = (e) => {
    setActiveButton(e);
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 200,
    },
    radius: 8,
    scales: {
      x: {
        reverse: false,
        ticks: {
          display: true,
        },

        grid: {
          drawBorder: true,
          display: false,

          offset: false,
          borderDash: [8, 4],
          color: '#000',
        },
        border: {
          display: true,
          dash: [10, 10],
        },
      },
      y: {
        reverse: false,
        min: 0,
        max:
          activeButton === BUTTON_SCORE_INDEX || activeButton === BUTTON_VELOCITY_INDEX || activeButton === BUTTON_ACCURACY_INDEX
            ? Number(readVelocityConstantMultiply)
            : GRAPH_MAX_VALUE,

        ticks: {
          display: true,
          stepSize:
            activeButton === BUTTON_VELOCITY_INDEX || activeButton === BUTTON_SCORE_INDEX || activeButton === BUTTON_ACCURACY_INDEX
              ? GRAPH_STEP_VALUE
              : 0,
        },
        grid: {
          drawBorder: false,
          display: true,
          tickBorderDash: [8, 4],
          tickColor: '#000',
          drawTicks: true,
          color: '#E5E7EB',
          offset: false,
        },
        border: {
          display: true,
          dash: [10, 10],
        },
      },
    },
  };
  console.log(selectedValues, dropdownValues, location?.state, 'location');
  return (
    <div>
      <div className="bg-white rounded-lg drop-shadow-xl flex justify-end mb-4 relative z-[1]">
        <DateSelector
          mode={dateMode}
          setMode={(e) => {
            setDateMode(e);
            if (e === 'M') {
              setStudentDetails((pre) => ({
                ...pre,
                assessmentDate: `${moment(studentDetails?.assessmentDate).format('YYYY-MM')}-01`,
              }));
            } else if (e === 'Y') {
              setStudentDetails((pre) => ({
                ...pre,
                assessmentDate: `${moment(studentDetails?.assessmentDate).format('YYYY-MM')}-01`,
              }));
            }
            localStorage.setItem('datemode', e);
          }}
          selectedDate={studyCircleDetails?.assessmentDate}
          handleChange={(e) => {
            setStudyCircleDetails((pre) => ({
              ...pre,
              assessmentDate: e,
            }));
            localStorage.setItem('selectedDate', e);
          }}
          setSelectedValues={(e) => {
            setAcademic_period_id(e);
            localStorage.setItem('selectedAcadamicPeriod', e);
          }}
          academic_period_id={academic_period_id}
        />
      </div>
      <StudyCircleProfile
        studyCircleDetails={studyCircleDetails}
        dropdownValues={dropdownValues}
        selectedValues={selectedValues}
        handleDropdownValues={handleDropdownValues}
      />

      <PerformanceMetrics performanceData={studentTrend.filter((i) => i.avg_response_velocity)} noDataFound={noDataFound} />
      <SubFilters
        dropdownValues={dropdownValues}
        handleStudentsDetails={handleStudentsDetails}
        selectedValues={selectedValues}
        handleDropdownValues={handleDropdownValues}
      />
      {noDataFound?.performanceData ? (
        <div className="mt-4 h-fit">
          <NoDataFound height={'fit-content'} />
        </div>
      ) : (
        <>
          <ReadVelocity data={studyCirclestudentPerformance} />

          <Trend
            data={studyCirclestudentPerformance}
            buttonData={buttonData}
            activeButton={activeButton}
            handleActiveButton={handleActiveButton}
            options={options}
            selectedButton={buttonData?.[activeButton]?.title}
          />
        </>
      )}

      <Toaster />
    </div>
  );
};

export default StudyCircleDetails;
