import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Box, Typography } from '@mui/material';
import { LightPurpleButton } from '../components/buttonStyles.js';
import './Homepage.css';
import logo from './logo.png'

const Homepage = () => {
    return (
        <Container className="container" maxWidth="100vh">
            <Grid container justifyContent="center" alignItems="center">
                <Grid item xs={12} md={8} lg={6}>
                    <Box className="paper" elevation={3}>
                        <img 
                            src={logo}
                            alt="Logo"
                            height="90px"
                            width="90px"
                            className="logo"
                        />
                        <h1 className="title">
                            Welcome to the JECRC Portal
                        </h1>
                        <Typography variant="body1" paragraph>
                            Simplify college management, class organization, add students and faculty.
                            Track attendance, assess performance, and provide feedback, marks, notices, and communicate effortlessly.
                        </Typography>
                        <Box className="button-wrapper">
                            <Link to="/choose" style={{ textDecoration: 'none' }}>
                                <LightPurpleButton variant="contained" fullWidth>
                                    Login
                                </LightPurpleButton>
                            </Link>
                            <Typography className="signup-text">
                                Don't have an account?{' '}
                                <Link to="/Adminregister" style={{ color: "#550080", textDecoration: 'none'}}>
                                    Sign up
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Homepage;
