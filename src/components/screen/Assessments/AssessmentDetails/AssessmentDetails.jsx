import React, { useEffect, useState, useContext } from 'react';
import { sideBarLayout } from '../../../layout/layout';
import Header from '../../../Application/AssessmentDetails/Header/Header';
import SessionDetails from '../../../Application/AssessmentDetails/SessionDetails/SessionDetails';
import StudyCircleModes from '../../../Application/AssessmentDetails/StudyCircleModes/StudyCircleModes';
import QuestionDetrails from '../../../Application/AssessmentDetails/QuestionDetails/QuestionDetails';
import {
  assessmentDetailHeaderSection,
  assessmentQuestionsSectionPieChart,
  assessmentStudentWiseSection,
} from '../../../../api/AssesmentDetails';
import { useLocation, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const AssessmentDetails = () => {
  const [searchParams] = useSearchParams();
  const contextValues = useContext(sideBarLayout);
  console.log(searchParams.get('sc'), 'location--');
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  console.log(location, id, 'qwerty');
  const [assessmentDetailHeader, setAssessmentDetailHeader] = useState([]);
  // const [assessmentQuestionDetailsData, setAssessmentQuestionDetailsData] = useState([]);
  const [assessmentQuestionsList, setAssessmentQuestionsList] = useState([]);
  // const [assessmentQuestionsSectionResponseDetailsData, setAssessmentQuestionsSectionResponseDetailsData] = useState([]);
  const [assessmentStudentWiseSectionData, setAssessmentStudentWiseSectionData] = useState([]);
  const [isDataAvailable, setIsDataAvailable] = useState({
    QuestionListData: false,
  });
  const [selectedAssesment, SetSelectedAssesment] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    SetSelectedAssesment(location?.state?.filter((i) => i.assessment_id === id));
    setIndex(location?.state?.findIndex((i) => i.assessment_id === id) || 0);
  }, [location]);
  const getStudyCircle = () => {
    return searchParams.get('sc') || location?.state?.filter((i) => i.assessment_id === id)?.[0]?.study_circle_id;
  };
  const getAllData = async () => {
    try {
      console.log(location, selectedAssesment, 'location');
      const results = await Promise.allSettled([
        assessmentDetailHeaderSection(
          id,
          getStudyCircle(),
          selectedAssesment?.[0].academic_period_id || searchParams.get('academic_period_id'),
        ),
        assessmentQuestionsSectionPieChart(id, getStudyCircle()),
        // assessmentQuestionDetails(),

        // assessmentQuestionsSectionResponseDetails(),
        assessmentStudentWiseSection(id, getStudyCircle()),
      ]);

      // Extract values or set as `null` for rejected promises
      const [assessment_Detail_Header_Section, assessment_Questions_Section_PieChart, assessment_StudentWise_Section] = results.map(
        (result) => (result.status === 'fulfilled' ? result.value : []),
      );

      console.log(
        assessment_Detail_Header_Section,

        assessment_Questions_Section_PieChart,

        assessment_StudentWise_Section,
        'All data loaded',
      );
      setAssessmentDetailHeader(assessment_Detail_Header_Section);
      // setAssessmentQuestionDetailsData(assessment_Question_Details);
      if (assessment_Questions_Section_PieChart?.length > 0) {
        setAssessmentQuestionsList(assessment_Questions_Section_PieChart);
        setIsDataAvailable((prev) => ({ ...prev, QuestionListData: true }));
        contextValues.setBreadCrumbName(`S# ${assessment_Detail_Header_Section?.session_code?.toLocaleUpperCase() || '--'}`);
      }
      // setAssessmentQuestionsSectionResponseDetailsData(assessment_Questions_Section_ResponseDetails);
      setAssessmentStudentWiseSectionData(assessment_StudentWise_Section);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    toast.dismiss();
    getAllData();
  }, [selectedAssesment]);
  const navigateButton = (e, name) => {
    if (name === 'previous') {
      navigate(`/assessments/assessmentdetails/${location?.state?.[index - 1]?.assessment_id}`, { state: location?.state });
    } else {
      navigate(`/assessments/assessmentdetails/${location?.state?.[index + 1]?.assessment_id}`, { state: location?.state });
    }
  };

  return (
    <main>
      <Header
        data={assessmentDetailHeader}
        index={index}
        maxIndex={location?.state?.length - 1 || 0}
        navigateButton={navigateButton}
      />
      <SessionDetails data={assessmentDetailHeader} locationState={location?.state} selectedAssesment={selectedAssesment} />
      <StudyCircleModes data={assessmentDetailHeader} />
      <QuestionDetrails
        isDataAvailable={isDataAvailable}
        studyCircleId={getStudyCircle()}
        questionList={assessmentQuestionsList}
        // questiionReport={assessmentQuestionsSectionResponseDetailsData}
        studentList={assessmentStudentWiseSectionData}
      />
    </main>
  );
};

export default AssessmentDetails;
