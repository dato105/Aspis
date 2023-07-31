import React, {useState} from 'react';
import style from './StageHeader.module.css';
import StepDetails from '../stepDetails/StepDetails';
import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Divider from '@mui/material/Divider';
import SignpostOutlinedIcon from '@mui/icons-material/SignpostOutlined';

function StageHeader(props) {
    const [isClick, setIsClick] = useState(false);

    function handleClick(event) {
        setIsClick(!isClick);
        setAnchorEl(event.currentTarget);
        setOpen(previousOpen => !previousOpen);
    }

    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const canBeOpen = open && Boolean(anchorEl);
    const id = canBeOpen ? 'spring-popper' : undefined;

    return (
        <div>
            <div className={style.stageHeader}>
                <h1 className={style.h1}>{props.title}</h1>
                <Divider className={style.dividerHeader} orientation="vertical" variant="middle" flexItem/>
                <Button
                    className={style.stepDetailsBtn}
                    sx={{
                        color: open ? '#212121' : '#000000',
                        backgroundColor: '#F6F6FA',
                        fontWeight: open ? 400 : 600,
                        ':hover': {
                            backgroundColor: '#F6F6FA',
                            color: '#212121',
                            fontWeight: '90%',
                        },
                        variant: 'text',
                        size: 'large',

                    }}
                    aria-describedby={id}
                    type="button"
                    onClick={handleClick}
                >
                    פירוט שלב
                    {isClick ? <KeyboardArrowDownIcon/> : <KeyboardArrowUpIcon/>}
                </Button>
            </div>
            {isClick ? (
                <div className={style.stageHeaderStatus}>
                    <SignpostOutlinedIcon className={style.iconDetailStatus}/>
                    <div className={style.stepDetailsStatus}>פירוט הסטטוסים השונים בשלב</div>
                    <StepDetails stages={props.subStageTabMap[0]}/>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}

export default StageHeader;