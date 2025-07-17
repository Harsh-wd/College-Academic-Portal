import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle.js';
import { deleteUser } from '../../../redux/userRelated/userHandle.js';
import { Paper, Box, IconButton, Typography, Button } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import PostAddIcon from '@mui/icons-material/PostAdd';
import TableTemplate from '../../../components/TableTemplate.jsx';
import { BlueButton, GreenButton } from '../../../components/buttonStyles.js';
import Popup from '../../../components/Popup.jsx';

const ShowSubjects = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { subjectsList, loading, error } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getSubjectList(currentUser._id, "AllSubjects"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        setMessage("Deleted successfully");
        setShowPopup(true);
        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getSubjectList(currentUser._id, "AllSubjects"));
            });
    };

    const subjectColumns = [
        { id: 'subName', label: 'Sub Name', minWidth: 170 },
        { id: 'sessions', label: 'Sessions', minWidth: 170 },
        { id: 'sclassName', label: 'Class', minWidth: 170 },
    ];

    const subjectRows = (subjectsList || []).map((subject) => ({
        subName: subject.subName,
        sessions: subject.sessions,
        sclassName: subject.sclassName.sclassName,
        sclassID: subject.sclassName._id,
        id: subject._id,
    }));

    const SubjectsButtonHaver = ({ row }) => (
        <>
            <IconButton onClick={() => deleteHandler(row.id, "Subject")}>
                <DeleteIcon color="error" />
            </IconButton>
            <BlueButton variant="contained"
                onClick={() => navigate(`/Admin/subjects/subject/${row.sclassID}/${row.id}`)}>
                View
            </BlueButton>
        </>
    );

    return (
        <>
            {loading ? (
                <Typography>Loading...</Typography>
            ) : (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <GreenButton
                            variant="contained"
                            startIcon={<PostAddIcon />}
                            onClick={() => navigate("/Admin/subjects/chooseclass")}
                        >
                            Add New Subject
                        </GreenButton>
                        <Button
                            onClick={() => deleteHandler(currentUser._id, "Subjects")}
                            color="error"
                            variant="contained"
                            startIcon={<DeleteIcon />}
                        >
                            Delete All Subjects
                        </Button>
                    </Box>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        {subjectRows.length > 0 ? (
                            <TableTemplate buttonHaver={SubjectsButtonHaver} columns={subjectColumns} rows={subjectRows} />
                        ) : (
                            <Typography sx={{ p: 2 }}>No subjects found.</Typography>
                        )}
                    </Paper>
                </>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default ShowSubjects;
