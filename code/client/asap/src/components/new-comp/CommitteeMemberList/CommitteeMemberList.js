import * as React from 'react';
import { Button, Box, Modal, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

function ChildModal() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Button onClick={handleOpen}>אישור</Button>
            <Modal
                hideBackdrop
                open={open}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style, width: 200 }}>
                    <h2 id="child-modal-title"></h2>
                    <p id="child-modal-description"></p>
                    <Button onClick={handleClose}>Close</Button>
                </Box>
            </Modal>
        </React.Fragment>
    );
}

export default function CommitteeMemberList() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button onClick={handleOpen}>Open Requests</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 550 }}>
                    <h2 id="parent-modal-title">הזנת החלטה של ועדת מינויים בנוגע למינוי חברי ועדה מקצועית</h2>
                    <p id="parent-modal-description">
                        <SchoolIcon></SchoolIcon>
                        פרופ' חיים כהן
                        <Button floated="left">
                            <Button variant="contained" color="success" style={{ width: 50 }}>
                                אישור
                            </Button>
                            <Button variant="outlined" color="error" style={{ width: 50 }}>
                                דחייה
                            </Button>
                        </Button>
                    </p>
                    <p id="parent-modal-description">
                        <SchoolIcon></SchoolIcon>
                        ד"ר אייל שני
                        <Button floated="left">
                            <Button variant="contained" color="success" style={{ width: 50 }}>
                                אישור
                            </Button>
                            <Button variant="outlined" color="error" style={{ width: 50 }}>
                                דחייה
                            </Button>
                        </Button>
                    </p>

                    <ChildModal />
                </Box>
            </Modal>
        </div>
    );
}
