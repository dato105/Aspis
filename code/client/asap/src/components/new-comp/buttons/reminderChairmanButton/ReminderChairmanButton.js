import style from '../../../page-admin/newRequest/NewRequest.module.css';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import ApproveSnackBar from '../../approveSnackBar/ApproveSnackBar';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import apiService from '../../../../services/api/api';

function ReminderChairmanButton(props) {
    const { title, setRender, card, stage } = props;
    const [open, setOpen] = useState(false);
    const message = 'נשלחה תזכורת ליו"ר ועדת מינויים';

    const handleClick = (stage, card) => {
        try {
            apiService.AdminService.remindToChairman(card.user_id).then(response => {});
        } catch (error) {}

        setOpen(true);
    };

    return (
        <div className={style.InProcessCardSubCardButton}>
            <Button
                className={style.waitRequestApproveBtn}
                onClick={() => handleClick(stage, card)}
                variant="contained"
                disableElevation
            >
                <NotificationsActiveOutlinedIcon />
                <div className={style.approveBtnText}>{title}</div>
            </Button>
            <ApproveSnackBar message={message} open={open} setOpen={setOpen} setRender={setRender} />
        </div>
    );
}

export default ReminderChairmanButton;