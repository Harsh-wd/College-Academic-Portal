import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getAllStudents } from '../../../redux/studentRelated/studentHandle.js';
import { deleteUser } from '../../../redux/userRelated/userHandle.js';
import { Paper, Box, IconButton, Button } from '@mui/material';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { BlueButton, GreenButton } from '../../../components/buttonStyles.js';
import TableTemplate from '../../../components/TableTemplate.jsx';
import Popup from '../../../components/Popup.jsx';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

const ShowStudents = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { studentsList, loading, error } = useSelector((state) => state.student);
    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getAllStudents(currentUser._id));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const [showPopup, setShowPopup] = React.useState(false);
    const [message, setMessage] = React.useState("");

    const deleteHandler = (deleteID, address) => {
        setMessage("Deleted successfully");
        setShowPopup(true);
        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getAllStudents(currentUser._id));
            });
    };

    const studentColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
        { id: 'sclassName', label: 'Class', minWidth: 170 },
    ];

    const studentRows = (studentsList || []).map((student) => ({
        name: student.name,
        rollNum: student.rollNum,
        sclassName: student.sclassName.sclassName,
        id: student._id,
    }));

    const StudentButtonHaver = ({ row }) => (
        <>
            <IconButton onClick={() => deleteHandler(row.id, "Student")}>
                <PersonRemoveIcon color="error" />
            </IconButton>
            <BlueButton variant="contained"
                onClick={() => navigate("/Admin/students/student/" + row.id)}>
                View
            </BlueButton>
        </>
    );

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                        <GreenButton
                            variant="contained"
                            startIcon={<PersonAddAlt1Icon />}
                            onClick={() => navigate("/Admin/addstudents")}
                        >
                            Add New Student
                        </GreenButton>
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<PersonRemoveIcon />}
                            onClick={() => deleteHandler(currentUser._id, "Students")}
                        >
                            Delete All Students
                        </Button>
                    </Box>
                    <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '16px' }}>
                        {studentRows.length > 0 ? (
                            <TableTemplate buttonHaver={StudentButtonHaver} columns={studentColumns} rows={studentRows} />
                        ) : (
                           <div>No Students Found</div>
                        )}
                    </Paper>
                </>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default ShowStudents;
