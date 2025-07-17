import { useEffect, useState } from 'react';
import { IconButton, Box, Button } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../../../redux/userRelated/userHandle.js';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle.js';
import { BlueButton, GreenButton } from '../../../components/buttonStyles.js';
import TableTemplate from '../../../components/TableTemplate.jsx';
import Popup from '../../../components/Popup.jsx';
import styled from 'styled-components';

const ShowClasses = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { sclassesList, loading, error } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector(state => state.user);
    const adminID = currentUser._id;

    useEffect(() => {
        dispatch(getAllSclasses(adminID, "Sclass"));
    }, [adminID, dispatch]);

    if (error) {
        console.log(error);
    }

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        setMessage("Deleted Successfully!");
        setShowPopup(true);
        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getAllSclasses(adminID, "Sclass"));
            });
    }

    const sclassColumns = [
        { id: 'name', label: 'Class Name', minWidth: 170 },
    ];

    const sclassRows = (sclassesList || []).map((sclass) => ({
        name: sclass.sclassName,
        id: sclass._id,
    }));

    const SclassButtonHaver = ({ row }) => {
        return (
            <ButtonContainer>
                <IconButton onClick={() => deleteHandler(row.id, "Sclass")}>
                    <DeleteIcon color="error" />
                </IconButton>
                <BlueButton variant="contained"
                    onClick={() => navigate("/Admin/classes/class/" + row.id)}>
                    View
                </BlueButton>
            </ButtonContainer>
        );
    };

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <GreenButton
                            variant="contained"
                            onClick={() => navigate("/Admin/addclass")}
                        >
                            Add New Class
                        </GreenButton>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => deleteHandler(adminID, "Sclasses")}
                        >
                            Delete All Classes
                        </Button>
                    </Box>
                    {sclassRows.length > 0 ? (
                        <TableTemplate
                            buttonHaver={SclassButtonHaver}
                            columns={sclassColumns}
                            rows={sclassRows}
                        />
                    ) : (
                        <div>No Classes Found</div>
                    )}
                </>
            )}
            <Popup
                message={message}
                setShowPopup={setShowPopup}
                showPopup={showPopup}
            />
        </>
    );
};

export default ShowClasses;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;
