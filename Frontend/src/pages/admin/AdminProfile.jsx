import { useSelector } from 'react-redux';
import styled from 'styled-components';

const AdminProfile = () => {
    // Use the useSelector hook to extract the currentUser object from the Redux store's user slice.
    const { currentUser } = useSelector((state) => state.user);

    return (
        <StyledContainer>
            <ContentBox>
                <Text><b> Name:</b> {currentUser.name} </Text>
                <Text><b>Email:</b>  {currentUser.email} </Text>
                <Text> <b>College:</b> {currentUser.schoolName} </Text>
            </ContentBox>
        </StyledContainer>
    );
};

const StyledContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 100px); /* Adjust as needed */
`;

const ContentBox = styled.div`
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    text-align: center;
`;

const Text = styled.p`
    margin: 10px 0;
`;

export default AdminProfile;
