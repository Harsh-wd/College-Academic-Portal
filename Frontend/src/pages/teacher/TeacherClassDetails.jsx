import { useEffect } from "react";
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getClassStudents } from "../../redux/sclassRelated/sclassHandle.js";
import { Paper, Box, Typography } from '@mui/material';
import { BlueButton } from "../../components/buttonStyles.js";
import TableTemplate from "../../components/TableTemplate.jsx";

const TeacherClassDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { sclassStudents, loading, error } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector((state) => state.user);
    const classID = currentUser.teachSclass?._id;

    useEffect(() => {
        if (classID) {
            dispatch(getClassStudents(classID));
        }
    }, [dispatch, classID]);

    if (error) {
        console.log(error);
    }

    const studentColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
    ];

    const studentRows = (sclassStudents || []).map((student) => ({
        name: student.name,
        rollNum: student.rollNum,
        id: student._id,
    }));

    const StudentsButtonHaver = ({ row }) => {
        return (
            <BlueButton
                variant="contained"
                onClick={() => navigate(`/Teacher/class/student/${row.id}`)}
            >
                View
            </BlueButton>
        );
    };

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Paper sx={{ width: '100%', overflow: 'hidden', p: 2 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Class Details
                    </Typography>
                    {studentRows.length > 0 ? (
                        <>
                            <Typography variant="h5" gutterBottom>
                                Students List:
                            </Typography>
                            <TableTemplate buttonHaver={StudentsButtonHaver} columns={studentColumns} rows={studentRows} />
                        </>
                    ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                            <Typography variant="h6">No Students Found</Typography>
                        </Box>
                    )}
                </Paper>
            )}
        </>
    );
};

export default TeacherClassDetails;
