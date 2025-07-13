import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { AccountCircle, School, Group } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/userRelated/userHandle.js';
import Popup from '../components/Popup.jsx';
import './ChooseUser.css';
import logo from './logo.png'

const ChooseUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const password = "zxc";

  const { status, currentUser, currentRole } = useSelector(state => state.user);

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const navigateHandler = (user) => {
    if (user === "Admin") {
      navigate('/Adminlogin');
    }
    else if (user === "Student") {
      navigate('/Studentlogin');
    }
    else if (user === "Teacher") {
      navigate('/Teacherlogin');
    }
  };

  useEffect(() => {
    if (status === 'success' || currentUser !== null) {
      if (currentRole === 'Admin') {
        navigate('/Admin/dashboard');
      }
      else if (currentRole === 'Student') {
        navigate('/Student/dashboard');
      } else if (currentRole === 'Teacher') {
        navigate('/Teacher/dashboard');
      }
    }
    else if (status === 'error') {
      setLoader(false);
      setMessage("Network Error");
      setShowPopup(true);
    }
  }, [status, currentRole, navigate, currentUser]);

  return (
    <div className="styled-container">
      <div className="styled-background" />
      <div className="styled-content">
        <img 
          src={logo}
          alt="Logo"
          className="styled-logo"
        />
        <h2 className="styled-subtitle">Choose User:</h2>
        <Grid container spacing={3} className="styled-grid">
          <Grid item xs={12} md={4}>
            <Paper onClick={() => navigateHandler("Admin")} className="styled-paper">
              <AccountCircle fontSize="large" />
              <h2 className="styled-typography">Admin</h2>
              Login as an administrator to access the dashboard to manage app data.
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper onClick={() => navigateHandler("Student")} className="styled-paper">
              <School fontSize="large" />
              <h2 className="styled-typography">Student</h2>
              Login as a student to explore course materials and assignments.
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper onClick={() => navigateHandler("Teacher")} className="styled-paper">
              <Group fontSize="large" />
              <h2 className="styled-typography">Teacher</h2>
              Login as a teacher to create courses, assignments, and track student progress.
            </Paper>
          </Grid>
        </Grid>
      </div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loader}
      >
        <CircularProgress color="inherit" />
        Please Wait
      </Backdrop>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </div>
  );
};

export default ChooseUser;
