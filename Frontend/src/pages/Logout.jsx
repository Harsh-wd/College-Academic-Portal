import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authLogout } from '../redux/userRelated/userSlice.js';
import styled from 'styled-components';

// Define the Logout functional component.
const Logout = () => {
  // Use the useSelector hook from Redux to access the current user's information from the Redux store.
    const currentUser = useSelector(state => state.user.currentUser);

    // Utilize the useNavigate hook from React Router DOM to enable navigation within the application.
    const navigate = useNavigate();
    // Use the useDispatch hook from Redux to dispatch actions.
    const dispatch = useDispatch();
    
    // Define two functions, handleLogout and handleCancel, to handle the logout action and cancel action respectively.
    /* HandleLogout dispatches the authLogout action creator from 
    Redux to log the user out and then navigates the user to the homepage ('/'). */
    const handleLogout = () => {
        dispatch(authLogout());
        navigate('/');
    };

    // handleCancel simply navigates the user back to the previous page using navigate(-1).
    const handleCancel = () => {
        navigate(-1);
    };

    // Render the UI components within a styled container (LogoutContainer).
    return (
        <LogoutContainer>
          {/* Display the current user's name. */}
            <h1>{currentUser.name}</h1>
            {/* Display a message asking the user if they are sure they want to log out. */}
            <LogoutMessage>Are you sure you want to log out?</LogoutMessage>
              {/* Render two buttons: one for logging out (LogoutButtonLogout) and one for 
            canceling the logout (LogoutButtonCancel). */}
            <LogoutButtonLogout onClick={handleLogout}>Log Out</LogoutButtonLogout>
            <LogoutButtonCancel onClick={handleCancel}>Cancel</LogoutButtonCancel>
        </LogoutContainer>
    );
};

export default Logout;

const LogoutContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  background-color: #85769f66;
  color: black;
`;

const LogoutMessage = styled.p`
  margin-bottom: 20px;
  font-size: 16px;
  text-align: center;
`;

const LogoutButton = styled.button`
  padding: 10px 20px;
  margin-top: 10px;
  border-radius: 5px;
  font-size: 16px;
  color: #fff;
  cursor: pointer;

  &:hover {
    color: #fff;
    background-color: #333;
  }
`;

const LogoutButtonLogout = styled(LogoutButton)`
  background-color: #ea0606;
`;

const LogoutButtonCancel = styled(LogoutButton)`
  background-color: rgb(99, 60, 99);
`;