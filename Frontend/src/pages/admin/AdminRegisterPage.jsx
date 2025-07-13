import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Box, Typography, Paper, TextField, CssBaseline, CircularProgress} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import bgpic from "../../assets/designlogin1.jpg";
console.log("Background Image Path:", bgpic);
import { LightPurpleButton } from '../../components/buttonStyles.js';
import { registerUser } from '../../redux/userRelated/userHandle.js';
import styled from 'styled-components';
import Popup from '../../components/Popup.jsx';

const defaultTheme = createTheme();

const AdminRegisterPage = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    //It initializes state variables using the useState hook to manage form input, 
    //loading state, error handling, and popup visibility.
    const { status, currentUser, response, error, currentRole } = useSelector(state => state.user);;

    /*
    The component uses the useState hook to manage various states:
    toggle: Manages the visibility of the password field.
    loader: Manages the loading state during form submission.
    showPopup: Manages the visibility of the popup component.
    message: Stores messages to be displayed in the popup.
   Error states (emailError, passwordError, adminNameError, schoolNameError): 
   Used for form validation to indicate if there are errors in the input fields.
*/
    const [toggle, setToggle] = useState(false)
    const [loader, setLoader] = useState(false)
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [adminNameError, setAdminNameError] = useState(false);
    const [schoolNameError, setSchoolNameError] = useState(false);
    const role = "Admin"

    //triggered when submit is clicked.
    const handleSubmit = (event) => {
        event.preventDefault();
        // It extracts the values of the input fields (admin name, school name, email, password).
        const name = event.target.adminName.value;
        const schoolName = event.target.schoolName.value;
        const email = event.target.email.value;
        const password = event.target.password.value;
        // Validates if any of the required fields are empty and sets the corresponding error states if necessary.
        if (!name || !schoolName || !email || !password) {
            if (!name) setAdminNameError(true);
            if (!schoolName) setSchoolNameError(true);
            if (!email) setEmailError(true);
            if (!password) setPasswordError(true);
            return;
        }

        const fields = { name, email, password, role, schoolName }
        setLoader(true)
        // Dispatches the registerUser action with the form data and role (Admin).
        dispatch(registerUser(fields, role))
    };
    // This function is triggered whenever there's a change in the input fields.
    const handleInputChange = (event) => {
        const { name } = event.target;
        // It resets the error state related to the input field being changed.
        if (name === 'email') setEmailError(false);
        if (name === 'password') setPasswordError(false);
        if (name === 'adminName') setAdminNameError(false);
        if (name === 'schoolName') setSchoolNameError(false);
    };

    // This hook runs after every render and performs side effects.
    useEffect(() => {
       
        
        if (status === 'success' || (currentUser !== null && currentRole === 'Admin')) {
            // if registration is successful or the user is already logged in as an admin, 
            // it redirects the user to the admin dashboard.
            navigate('/Admin/dashboard');
        }
        else if (status === 'failed') {
            setMessage(response)
            setShowPopup(true)
            setLoader(false)
        }
        else if (status === 'error') {
            console.log(error)
        }
    }, // It listens for changes in the registration status (status), currentUser, and currentRole.
     [status, currentUser, currentRole, navigate, error, response]);

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
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
                            Admin Registration 
                        </Typography>
                        <Typography variant="h7">
                            Use the JECRC admin Registration portal to register your own college as an admin
                            <br />
                            You will be able to add students and faculty and manage the system.
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="adminName"
                                label="Enter your name"
                                name="adminName"
                                autoComplete="name"
                                autoFocus
                                error={adminNameError}
                                helperText={adminNameError && 'Name is required'}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="schoolName"
                                label="Create your school name"
                                name="schoolName"
                                autoComplete="off"
                                error={schoolNameError}
                                helperText={schoolNameError && 'School name is required'}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Enter your email"
                                name="email"
                                autoComplete="email"
                                error={emailError}
                                helperText={emailError && 'Email is required'}
                                onChange={handleInputChange}
                            />
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
                            
                            <LightPurpleButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {loader ? <CircularProgress size={24} color="inherit"/> : "Register"}
                            </LightPurpleButton>
                            <Grid container>
                                <Grid>
                                    Already have an account?
                                </Grid>
                                <Grid item sx={{ ml: 2 }}>
                                    <StyledLink to="/Adminlogin">
                                        Log in
                                    </StyledLink>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    style={{
    backgroundImage: `url(${bgpic})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: (t) =>
      t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
  }}
                />
            </Grid>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </ThemeProvider>
    );
}

export default AdminRegisterPage

const StyledLink = styled(Link)`
  margin-top: 9px;
  text-decoration: none;
  color: #7f56da;
`;
