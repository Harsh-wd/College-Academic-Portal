import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle.js';
import { getClassDetails, getClassStudents, getSubjectList } from "../../../redux/sclassRelated/sclassHandle.js";
import { deleteUser } from '../../../redux/userRelated/userHandle.js';
import {
    Box, Container, Typography, Tab, IconButton
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { BlueButton, GreenButton } from "../../../components/buttonStyles.js";
import TableTemplate from "../../../components/TableTemplate.jsx";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import Popup from "../../../components/Popup.jsx";
import DeleteIcon from "@mui/icons-material/Delete";

const ClassDetails = () => {
    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { teachersList } = useSelector((state) => state.teacher);
    const { subjectsList, sclassStudents, sclassDetails, loading, error, response, getresponse } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector((state) => state.user);
    const classID = params.id

    useEffect(() => {
        dispatch(getClassDetails(classID, "Sclass"));
        dispatch(getSubjectList(classID, "ClassSubjects"))
        dispatch(getClassStudents(classID));
        dispatch(getAllTeachers(currentUser._id));
    }, [dispatch, classID, currentUser._id])

    if (error) {
        console.log(error)
    }

    const [value, setValue] = useState('1');
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const deleteHandler = (deleteID, address) => {
        setMessage("Deleted Successfully!");
        setShowPopup(true);
        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getClassStudents(classID));
                dispatch(getSubjectList(classID, "ClassSubjects"));
            });
    }

    const subjectColumns = [
        { id: 'name', label: 'Subject Name', minWidth: 170 },
        { id: 'code', label: 'Subject Code', minWidth: 100 },
    ]

    const subjectRows = (subjectsList || []).map((subject) => ({
        name: subject.subName,
        code: subject.subCode,
        id: subject._id,
    }));

    const SubjectsButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Subject")}>
                    <DeleteIcon color="error" />
                </IconButton>
                <BlueButton
                    variant="contained"
                    onClick={() => navigate(`/Admin/class/subject/${classID}/${row.id}`)}
                >
                    View
                </BlueButton >
            </>
        );
    };

    const ClassSubjectsSection = () => {
        return (
            <>
                <Typography variant="h5" gutterBottom>
                    Subjects List:
                </Typography>
                {subjectRows.length > 0 ? (
                    <TableTemplate buttonHaver={SubjectsButtonHaver} columns={subjectColumns} rows={subjectRows} />
                ) : (
                    <Typography>No subjects found for this class.</Typography>
                )}
                 <GreenButton variant="contained" onClick={() => navigate(`/Admin/addsubject/${classID}`)}>
                    Add Subjects
                </GreenButton>
            </>
        )
    }

    const studentColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
    ]

    const studentRows = (sclassStudents || []).map((student) => ({
        name: student.name,
        rollNum: student.rollNum,
        id: student._id,
    }));

    const StudentsButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Student")}>
                    <PersonRemoveIcon color="error" />
                </IconButton>
                <BlueButton
                    variant="contained"
                    onClick={() => navigate("/Admin/students/student/" + row.id)}
                >
                    View
                </BlueButton>
            </>
        );
    };

    const ClassStudentsSection = () => {
        return (
            <>
                <Typography variant="h5" gutterBottom>
                    Students List:
                </Typography>
                {studentRows.length > 0 ? (
                    <TableTemplate buttonHaver={StudentsButtonHaver} columns={studentColumns} rows={studentRows} />
                ) : (
                    <Typography>No students found for this class.</Typography>
                )}
                 <GreenButton variant="contained" onClick={() => navigate(`/Admin/class/addstudents/${classID}`)}>
                    Add Students
                </GreenButton>
            </>
        )
    }

    const teacherColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'teachSubject', label: 'Subject', minWidth: 100 },
        { id: 'teachSclass', label: 'Class', minWidth: 170 },
    ];

    const teacherRows = (teachersList || []).filter(teacher => teacher.teachSclass?._id === classID).map((teacher) => ({
        name: teacher.name,
        teachSubject: teacher.teachSubject?.subName || "Not Assigned",
        teachSclass: teacher.teachSclass.sclassName,
        id: teacher._id,
    }));

    const TeacherButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Teacher")}>
                    <PersonRemoveIcon color="error" />
                </IconButton>
                <BlueButton
                    variant="contained"
                    onClick={() => navigate("/Admin/teachers/teacher/" + row.id)}
                >
                    View
                </BlueButton>
            </>
        );
    };

    const ClassTeachersSection = () => {
        return (
            <>
                <Typography variant="h5" gutterBottom>
                    Teachers List:
                </Typography>
                {teacherRows.length > 0 ? (
                    <TableTemplate buttonHaver={TeacherButtonHaver} columns={teacherColumns} rows={teacherRows} />
                ) : (
                    <Typography>No teachers found for this class.</Typography>
                )}
                 <GreenButton variant="contained" onClick={() => navigate(`/Admin/teachers/chooseclass`)}>
                    Add Teacher
                </GreenButton>
            </>
        )
    }

    const ClassDetailsSection = () => {
        const numberOfSubjects = subjectsList?.length || 0;
        const numberOfStudents = sclassStudents?.length || 0;

        return (
            <>
                <Typography variant="h4" align="center" gutterBottom>
                    Class Details
                </Typography>
                <Typography variant="h5" gutterBottom>
                    This is Class {sclassDetails && sclassDetails.sclassName}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Number of Subjects: {numberOfSubjects}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Number of Students: {numberOfStudents}
                </Typography>
            </>
        );
    }

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <Box sx={{ width: '100%', typography: 'body1' }} >
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange} sx={{ position: 'fixed', width: '100%', bgcolor: 'background.paper', zIndex: 1 }}>
                                    <Tab label="Details" value="1" />
                                    <Tab label="Subjects" value="2" />
                                    <Tab label="Students" value="3" />
                                    <Tab label="Teachers" value="4" />
                                </TabList>
                            </Box>
                            <Container sx={{ marginTop: "3rem", marginBottom: "4rem" }}>
                                <TabPanel value="1">
                                    <ClassDetailsSection />
                                </TabPanel>
                                <TabPanel value="2">
                                    <ClassSubjectsSection />
                                </TabPanel>
                                <TabPanel value="3">
                                    <ClassStudentsSection />
                                </TabPanel>
                                <TabPanel value="4">
                                    <ClassTeachersSection />
                                </TabPanel>
                            </Container>
                        </TabContext>
                    </Box>
                </>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default ClassDetails;
