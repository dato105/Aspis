import React from 'react';
import { Button } from '@mui/material';
import style from '../Button.module.css';
import AddCommitteeCandidatePopper from '../../addCommitteeCandidatePopper/AddCommitteeCandidatePopper';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';

function AddCommitteeCandidateButton(props) {
    const { title, setOpen, open, card, stage, setRender, setCountCommitteeCand } = props;

    const handleClick = () => {
        setOpen(true);
    };

    return (
        <div>
            <Button
                className={style.waitRequestApproveBtn}
                onClick={() => handleClick(stage, card)}
                variant="contained"
                disableElevation
            >
                <PersonAddAltOutlinedIcon />
                <div className={style.approveBtnText}>{title}</div>
            </Button>
            <AddCommitteeCandidatePopper
                setOpen={setOpen}
                open={open}
                card={card}
                stage={stage}
                setRender={setRender}
                setCountCommitteeCand={setCountCommitteeCand}
            />
        </div>
    );
}

export default AddCommitteeCandidateButton;
