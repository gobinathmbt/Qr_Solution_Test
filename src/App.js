// App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Nav';
import Home from './Components/Home';
import CourseTable from './Components/CourseTable';
import StudentTable from './Components/StudentTable';
import TrainingSchedule from './Components/TrainingSchedule';
import StudentTrainingTable from './Components/Training';
import Login from './Components/Login';
import PrivateRoute from './DataBaseConfig/PrivateRoute';

const MasterHome = () => {
  return (
    <>
      <Navbar />
      <Home />
    </>
  );
};

const MasterCourse = () => {
  return (
    <>
      <Navbar />
      <CourseTable />
    </>
  );
};

const MasterStudent = () => {
  return (
    <>
      <Navbar />
      <StudentTable />
    </>
  );
};
const MasterSchedules = () => {
  return (
    <>
      <Navbar />
      <TrainingSchedule />
    </>
  );
};
const MasterTraining = () => {
  return (
    <>
      <Navbar />
      <StudentTrainingTable />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <MasterHome />
            </PrivateRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <PrivateRoute>
              <MasterCourse />
            </PrivateRoute>
          }
        />
        <Route
          path="/students"
          element={
            <PrivateRoute>
              <MasterStudent />
            </PrivateRoute>
          }
        />
        <Route
          path="/schedules"
          element={
            <PrivateRoute>
              <MasterSchedules />
            </PrivateRoute>
          }
        />
        <Route
          path="/training"
          element={
            <PrivateRoute>
              <MasterTraining />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
