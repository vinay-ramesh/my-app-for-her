import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/layout/layout';
import Login from './components/screen/login/login';
import ImageAssets from './assets/imageAsset';
import './App.css';
import StudentDetails from './components/screen/StudentDetails/StudentDetails';
import ResetPassword from './components/screen/login/ResetPassword/ResetPassword';
import NewPassword from './components/screen/login/NewPassword/NewPassword';
import StudentsSummary from './components/screen/Students/StudentsSummary/StudentsSummary';
import AssessmentDetails from './components/screen/Assessments/AssessmentDetails/AssessmentDetails';
import StudyCircleDetails from './components/screen/StudyCircle/StudyCircleDetails/StudyCircleDetails';
import StudyCircleSummary from './components/screen/StudyCircle/StudyCircleSummary/StudyCircleSummary';
import AssessmentSummary from './components/screen/Assessments/AssessmentSummary/AssessmentSummary';
import ParticipationSummary from './components/screen/Participation/ParticipationSummary';

export const menuItems = [
  {
    id: 1,
    name: 'Dashboard',
    path: '/dashboard',
    icon: ImageAssets.dashboardIcon,
    activePaths: ['dashboard'],
  },
  {
    id: 2,
    name: 'Study Circle',
    path: 'studycircle',
    icon: ImageAssets.studyCircleIcon,
    activePaths: ['studycircle'],
  },
  {
    id: 3,
    name: 'Students',
    path: '/students',
    icon: ImageAssets.studentsIcon,
    activePaths: ['students'],
  },
  {
    id: 4,
    name: 'Assessments',
    path: '/assessments',
    icon: ImageAssets.assignmentsIcon,
    activePaths: ['assessments'],
  },
  {
    id: 5,
    name: 'Participation',
    path: '/participation',
    icon: ImageAssets.participationIcon,
    activePaths: ['participation'],
  },
  {
    id: 6,
    name: 'Reports',
    path: '/report',
    icon: ImageAssets.reportIcon,
    activePaths: ['report'],
  },
];

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} index />
          <Route path="/:user_id/new-password" element={<NewPassword />} exact />
          <Route path="/reset-password" element={<ResetPassword />} exact />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<div>{'Dashboard'}</div>} />
            <Route path="/students/studentdetails/:name" element={<StudentDetails />} />
            <Route path="/assessments/assessmentdetails/:id" element={<AssessmentDetails />} />
            <Route path="/studycircle/studycircledetails/:id" element={<StudyCircleDetails />} exact />
            <Route path="/students" element={<StudentsSummary />} />
            <Route path="/studycircle" element={<StudyCircleSummary />} exact />
            <Route path="/assessments" element={<AssessmentSummary />} />
            <Route path="participation" element={<ParticipationSummary />} />
            <Route path="*" element={<div>Page NOt Found</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
