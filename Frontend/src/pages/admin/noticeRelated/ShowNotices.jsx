import React, { useEffect,useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { Paper, Box, IconButton, Button } from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllNotices } from '../../../redux/noticeRelated/noticeHandle.js';
import { deleteUser } from '../../../redux/userRelated/userHandle.js';
import TableTemplate from '../../../components/TableTemplate.jsx';
import Popup from '../../../components/Popup.jsx';

const ShowNotices = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { noticesList, loading, error } = useSelector((state) => state.notice);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getAllNotices(currentUser._id, "Notice"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }
    const [showPopup, setShowPopup] = useState(false);
     const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        setMessage("Deleted successfully, refresh the page");
        setShowPopup(true);
        dispatch(deleteUser(deleteID, address))
        
            .then(() => {
                dispatch(getAllNotices(currentUser._id, "Notice"));
            });
    };

    const noticeColumns = [
        { id: 'title', label: 'Title', minWidth: 170 },
        { id: 'details', label: 'Details', minWidth: 100 },
        { id: 'date', label: 'Date', minWidth: 170 },
    ];

    const noticeRows = noticesList?.length > 0
        ? noticesList.map((notice) => {
              const date = new Date(notice.date);
              const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
              return {
                  title: notice.title,
                  details: notice.details,
                  date: dateString,
                  id: notice._id,
              };
          })
        : [];

    const NoticeButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Notice")}>
                    <DeleteIcon color="error" />
                </IconButton>
            </>
        );
    };

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        {/* Add New Notice Button */}
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<NoteAddIcon />}
                            onClick={() => navigate("/Admin/addnotice")}
                        >
                            Add New Notice
                        </Button>

                        {/* Delete All Notices Button */}
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => deleteHandler(currentUser._id, "Notices")}
                        >
                            Delete All Notices
                        </Button>
                    </Box>

                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        {Array.isArray(noticesList) && noticesList.length > 0 ? (
                            <TableTemplate
                                buttonHaver={NoticeButtonHaver}
                                columns={noticeColumns}
                                rows={noticeRows}
                            />
                        ) : (
                            <div>No notices available.</div>
                        )}
                    </Paper>
                </>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default ShowNotices;
