import Button from '@mui/material/Button';
import React, {useState} from 'react';
import apiService from '../../../../services/api/api';
import ApproveSnackBar from '../../approveSnackBar/ApproveSnackBar';
import style from '../../../page-admin/newRequest/NewRequest.module.css';
import {canCancelStages} from '../../../../constants';

function ButtonApprove(props) {
    const {title, setRender, card, stage} = props;
    const [open, setOpen] = useState(false);
    const message = 'בקשה הועברה ליו"ר מינויים';

    const handleClick = (stage, card) => {
        let can_cancel = 0;
        if (canCancelStages.includes(card.step_name)) can_cancel = 1;

        apiService.AdminService.updateApplicationStep(stage.nextStepName, card.app_id, can_cancel, card.id).then(
            response => response.data
        );

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
                <div className={style.approveBtnText}>{title}</div>
            </Button>
            <ApproveSnackBar message={message} open={open} setOpen={setOpen} setRender={setRender}/>
        </div>
    );
}

export default ButtonApprove;