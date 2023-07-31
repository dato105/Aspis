import React, { useEffect } from 'react';
import { Box, Modal } from '@mui/material';
import style from './ApproveSnackBar.module.css';
import Icons from '../approvalaction/Icons.png';

function ApproveSnackBar(props) {
    const { message, open, setOpen, setRender } = props;

    useEffect(() => {
        setTimeout(() => {
            setOpen(false);
            setRender(false);
        }, 5000);
    }, [open, setOpen, setRender]);

    if (!open) {
        return <></>;
    }

    return (
        <div>
            <Modal open={true}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '25%',
                        backgroundColor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <div className={style.popperIcon}>
                        <img src={Icons} alt="v" />
                    </div>
                    <div className={style.popperText}>{message}</div>
                </Box>
            </Modal>
        </div>
    );
}

export default ApproveSnackBar;
