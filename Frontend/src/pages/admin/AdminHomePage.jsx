import { Container, Grid, Paper } from '@mui/material';
import SeeNotice from '../../components/SeeNotice.jsx';
import Students from "../../assets/img1.png";
import Classes from "../../assets/img2.png";
import Teachers from "../../assets/img3.png";
import styled from 'styled-components';
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle.js';
import { getAllStudents } from '../../redux/studentRelated/studentHandle.js';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle.js';

// Define the AdminHomePage functional component.
const AdminHomePage = () => {
    // Use Redux hooks (useDispatch and useSelector) to dispatch actions and access state from the Redux store.
    const dispatch = useDispatch();
    const { studentsList } = useSelector((state) => state.student);
    const { sclassesList } = useSelector((state) => state.sclass);
    const { teachersList } = useSelector((state) => state.teacher);

    const { currentUser } = useSelector(state => state.user)

    const adminID = currentUser._id
    // Fetch necessary data such as students, classes, and teachers using Redux actions 
    // (getAllStudents, getAllSclasses, getAllTeachers) within an useEffect hook.
    useEffect(() => {
        dispatch(getAllStudents(adminID));
        dispatch(getAllSclasses(adminID, "Sclass"));
        dispatch(getAllTeachers(adminID));
    }, [adminID, dispatch]);

    // Calculate the number of students, classes, and teachers based on the fetched data.
    const numberOfStudents = studentsList && studentsList.length;
    const numberOfClasses = sclassesList && sclassesList.length;
    const numberOfTeachers = teachersList && teachersList.length;

    return (
        <StyledContainer>
            {/* create a grid layout for displaying statistics and notices. */}
            
            <Grid container spacing={3}>
            {/* Each Grid item contains a Paper component with an image, 
            title, and count of students, classes, and teachers. */}
                <Grid item xs={12} md={4}>
                    <StyledPaper>
                        <img src={Students} alt="Students" />
                        <Title>Total Students</Title>
                        <Data start={0} end={numberOfStudents} duration={2.5} />
                    </StyledPaper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <StyledPaper>
                        <img src={Classes} alt="Classes" />
                        <Title>Total Classes</Title>
                        <Data start={0} end={numberOfClasses} duration={5} />
                    </StyledPaper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <StyledPaper>
                        <img src={Teachers} alt="Teachers" />
                        <Title>Total Teachers</Title>
                        <Data start={0} end={numberOfTeachers} duration={2.5} />
                    </StyledPaper>
                </Grid>
                <Grid item xs={12}>
                    <StyledNoticePaper>
                    {/* The SeeNotice component is displayed in its own Grid item, allowing the admin to view notices. */}
                        <SeeNotice />
                    </StyledNoticePaper>
                </Grid>
            </Grid>
        </StyledContainer>
    );
};

const StyledContainer = styled(Container)`
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

const StyledPaper = styled(Paper)`
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 200px;
  justify-content: space-between;
  align-items: center;
  text-align: center;
`;

const StyledNoticePaper = styled(Paper)`
  padding: 16px;
`;

const Title = styled.p`
  font-size: 1.25rem;
`;

const Data = styled(CountUp)`
  font-size: calc(1.3rem + .6vw);
  color: green;
`;

export default AdminHomePage;
