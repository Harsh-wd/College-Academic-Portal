import React, { useEffect, useState } from 'react'; // Import React and necessary hooks
import { Link, useNavigate } from 'react-router-dom'; // Import navigation utilities from react-router-dom
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks for dispatching actions and accessing state
import {Grid, Box, Typography, Paper,TextField, CssBaseline, CircularProgress, Backdrop } from '@mui/material'; // Import Material-UI components
import { createTheme, ThemeProvider } from '@mui/material/styles'; // Import Material-UI theme related utilities

import bgpic from "../assets/designlogin1.jpg"; // Import background image
import { LightPurpleButton } from '../components/buttonStyles.js'; // Import custom button styles
import styled from 'styled-components'; // Import styled-components for custom styling
import { loginUser } from '../redux/userRelated/userHandle.js'; // Import loginUser action
import Popup from '../components/Popup.jsx'; // Import Popup component

// Create a default Material-UI theme
const defaultTheme = createTheme();

// Define the LoginPage component
const LoginPage = ({ role }) => {
    // Initialize React hooks for state management and navigation
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Retrieve user-related state from Redux store
    const { status, currentUser, response, error, currentRole } = useSelector(state => state.user);

    // State variables to manage component state
    const [toggle, setToggle] = useState(false);
    const [guestLoader, setGuestLoader] = useState(false);
    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    // State variables to manage form input errors
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [rollNumberError, setRollNumberError] = useState(false);
    const [studentNameError, setStudentNameError] = useState(false);

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();

        if (role === "Student") {
            // Extract form data for student login
            const rollNum = event.target.rollNumber.value;
            const studentName = event.target.studentName.value;
            const password = event.target.password.value;

            // Validate form fields
            if (!rollNum || !studentName || !password) {
                if (!rollNum) setRollNumberError(true);
                if (!studentName) setStudentNameError(true);
                if (!password) setPasswordError(true);
                return;
            }

            // Dispatch loginUser action for student login
            const fields = { rollNum, studentName, password };
            setLoader(true);
            dispatch(loginUser(fields, role));
        } else {
            // Extract form data for non-student login
            const email = event.target.email.value;
            const password = event.target.password.value;

            // Validate form fields
            if (!email || !password) {
                if (!email) setEmailError(true);
                if (!password) setPasswordError(true);
                return;
            }

            // Dispatch loginUser action for non-student login
            const fields = { email, password };
            setLoader(true);
            dispatch(loginUser(fields, role));
        }
    };

    // Handle form input changes
    const handleInputChange = (event) => {
        const { name } = event.target;
        // Reset corresponding form input error state
        if (name === 'email') setEmailError(false);
        if (name === 'password') setPasswordError(false);
        if (name === 'rollNumber') setRollNumberError(false);
        if (name === 'studentName') setStudentNameError(false);
    };

    // Effect hook to handle side effects such as navigation and displaying popups
    useEffect(() => {
        if (status === 'success' || currentUser !== null) {
            // Redirect user based on their role after successful login
            if (currentRole === 'Admin') {
                navigate('/Admin/dashboard');
            } else if (currentRole === 'Student') {
                navigate('/Student/dashboard');
            } else if (currentRole === 'Teacher') {
                navigate('/Teacher/dashboard');
            }
        } else if (status === 'failed') {
            // Display error message in a popup
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        } else if (status === 'error') {
            // Display network error message in a popup
            setMessage("Network Error");
            setShowPopup(true);
            setLoader(false);
            setGuestLoader(false);
        }
    }, [status, currentRole, navigate, error, response, currentUser]);

    // Return JSX representing the login page layout
    return (
        <ThemeProvider theme={defaultTheme}>
            {/* Main container for the login page */}
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                {/* Login form section */}
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{ 
                            // backgroundColor: 'gray',
                            paddingTop: '80px',
                            // margin: '10px',
                            textAlign: 'center',
                            borderRadius: '10px',
                           

                            }}>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="h4" sx={{ mb: 2, color: "#2c2143" }}>
                            <b>Login</b>
                        </Typography>
                        <Typography variant="h7">
                            Welcome to the JECRC {role} login page. Please enter your details
                        </Typography>
                        {/* Login form */}
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
                            {/* Render different form fields based on user role */}
                            {role === "Student" ? (
                                <>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="rollNumber"
                                        label="Enter your Roll Number"
                                        name="rollNumber"
                                        autoComplete="off"
                                        type="number"
                                        autoFocus
                                        error={rollNumberError}
                                        helperText={rollNumberError && 'Roll Number is required'}
                                        onChange={handleInputChange}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="studentName"
                                        label="Enter your name"
                                        name="studentName"
                                        autoComplete="name"
                                        autoFocus
                                        error={studentNameError}
                                        helperText={studentNameError && 'Name is required'}
                                        onChange={handleInputChange}
                                    />
                                </>
                            ) : (
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Enter your email"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    error={emailError}
                                    helperText={emailError && 'Email is required'}
                                    onChange={handleInputChange}
                                />
                            )}
                            {/* Password field */}
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={toggle ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                error={passwordError}
                                helperText={passwordError && 'Password is required'}
                                onChange={handleInputChange}
                               
                            />

                           
                            
                            {/* Login button */}
                            <LightPurpleButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3 }}
                            >
                                {/* Show loading spinner if loader is true */}
                                {loader ?
                                    <CircularProgress size={24} color="inherit" />
                                    : "Login"}
                            </LightPurpleButton>
                            {/* Sign up link for Admin role */}
                            {role === "Admin" &&
                                <Grid container>
                                    <Grid>
                                        <br></br>
                                        Don't have an account?
                                    </Grid>
                                    <Grid item sx={{ ml: 2 }}>
                                        <StyledLink to="/Adminregister">
                                        <br></br>
                                            Sign up
                                        </StyledLink>
                                    </Grid>
                                </Grid>
                            }
                        </Box>
                    </Box>
                </Grid>
                {/* Background image section */}
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: `url(${bgpic})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            </Grid>
            {/* Backdrop for guest loader */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={guestLoader}
            >
                <CircularProgress color="primary" />
                Please Wait
            </Backdrop>
            {/* Popup for displaying error or informational messages */}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </ThemeProvider>
    );
}

export default LoginPage; // Export the LoginPage component

// Styled link component for custom styling
const StyledLink = styled(Link)`
  margin-top: 9px;
  text-decoration: none;
  color: #7f56da;
`;