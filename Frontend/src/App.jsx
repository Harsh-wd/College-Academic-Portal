import React from 'react'
// Imports necessary components from react-router-dom for handling routing in the application.
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
//Imports the useSelector hook from react-redux, which allows components to extract data from the Redux store.
import { useSelector } from 'react-redux';
//Below we import various components used in the application, such as Homepage, AdminDashboard, StudentDashboard, etc
import Homepage from './pages/Homepage.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import StudentDashboard from './pages/student/StudentDashboard.jsx';
import TeacherDashboard from './pages/teacher/TeacherDashboard.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AdminRegisterPage from './pages/admin/AdminRegisterPage.jsx';
import ChooseUser from './pages/ChooseUser.jsx';

// Defines the main functional component App.
const App = () => {
  //Uses the useSelector hook to extract the currentRole from the Redux store's user state.
  const { currentRole } = useSelector(state => state.user);

  return (
    //The <Router> component from react-router-dom wraps the entire application to provide routing functionality.
    // The component renders different content based on the currentRole
    <Router>
      {currentRole === null &&
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/choose" element={<ChooseUser visitor="normal" />} />
          <Route path="/Adminlogin" element={<LoginPage role="Admin" />} />
          <Route path="/Studentlogin" element={<LoginPage role="Student" />} />
          <Route path="/Teacherlogin" element={<LoginPage role="Teacher" />} />

          <Route path="/Adminregister" element={<AdminRegisterPage />} />

          <Route path='*' element={<Navigate to="/" />} />
        </Routes>}

      {currentRole === "Admin" &&
        <>
          <AdminDashboard />
        </>
      }

      {currentRole === "Student" &&
        <>
          <StudentDashboard />
        </>
      }

      {currentRole === "Teacher" &&
        <>
          <TeacherDashboard />
        </>
      }
    </Router>
  )
}

export default App