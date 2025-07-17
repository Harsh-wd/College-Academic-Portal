import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllNotices } from '../redux/noticeRelated/noticeHandle.js';
import { Paper, Typography } from '@mui/material';
import TableTemplate from './TableTemplate.jsx'; // Corrected import

const SeeNotice = () => {
    const dispatch = useDispatch();

    const { currentUser, currentRole } = useSelector(state => state.user);
    const { noticesList, loading, error, response } = useSelector((state) => state.notice);

    useEffect(() => {
        if (currentRole === "Admin") {
            dispatch(getAllNotices(currentUser._id, "Notice"));
        }
        else if (currentUser.school) {
            dispatch(getAllNotices(currentUser.school._id, "Notice"));
        }
    }, [dispatch, currentUser, currentRole]);

    if (error) {
        console.log(error);
    }

    const noticeColumns = [
        { id: 'title', label: 'Title', minWidth: 170 },
        { id: 'details', label: 'Details', minWidth: 100 },
        { id: 'date', label: 'Date', minWidth: 170 },
    ];

    const noticeRows = noticesList && noticesList.length > 0 ? noticesList.map((notice) => {
        const date = new Date(notice.date);
        const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
        return {
            title: notice.title,
            details: notice.details,
            date: dateString,
            id: notice._id,
        };
    }) : [];

    return (
        <div style={{ marginTop: '50px', marginRight: '20px' }}>
            {loading ? (
                <Typography>Loading...</Typography>
            ) : response ? (
                <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>No Notices to Show Right Now</Typography>
            ) : (
                <>
                    <Typography variant="h4" sx={{ textAlign: 'center', mb: 4 }}>Notices</Typography>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        {Array.isArray(noticesList) && noticesList.length > 0 &&
                            <TableTemplate columns={noticeColumns} rows={noticeRows} />
                        }
                    </Paper>
                </>
            )}
        </div>
    );
}

export default SeeNotice;
