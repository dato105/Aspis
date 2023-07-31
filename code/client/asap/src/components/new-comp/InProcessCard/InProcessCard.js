import * as React from 'react';
import style from './InProcessCard.module.css';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Button from '@mui/material/Button';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import img from '../../icons/candidateBag.png';
import { ASAP_ADMIN_CANDIDATE_PAGE } from '../../../services/routing/routes';
import { useNavigate } from 'react-router-dom';
import apiService from '../../../services/api/api';

export default function InProcessCard(props) {
    const { card, stage, setRender } = props;
    const navigate = useNavigate();
    const handleClick = () => {
        apiService.AdminService.updateApplicationStep(stage.nextStepName, card.app_id, 1, card.id).then(
            response => response.data
        );
        setRender(false);
    };

    return (
        <div className={style.InProcessCard}>
            <div className={style.InProcessCardBox}>
                <div className={style.candidateName}>{card.applicant}</div>
                <div className={style.InProcessCardSubCard}>
                    <div className={style.subHeader}> תאריך פתיחת בקשה</div>
                    <div className={style.parameter}>{card.created_at}</div>
                </div>
                <div className={style.InProcessCardSubCard}>
                    <div className={style.subHeader}> ימי המתנה</div>
                    <div className={style.parameter}>{card.wait_time}</div>
                </div>
                <div className={style.InProcessCardSubCard}>
                    <div className={style.subHeader}>
                        עודכן לאחרונה
                        <ErrorOutlineOutlinedIcon className={style.errorIcon}></ErrorOutlineOutlinedIcon>
                    </div>
                    <div className={style.parameter}>{card.last_update}</div>
                </div>
            </div>
            <Button variant="text" onClick={handleClick}></Button>
            <Button
                variant="text"
                className={style.candidateBagBtn}
                onClick={() => {
                    navigate(`/${ASAP_ADMIN_CANDIDATE_PAGE}/${card.user_id}`);
                }}
            >
                <img src={img} className={style.candidateBag} alt={'מועמד'} />
                תיק מועמד
                <ArrowBackIosOutlinedIcon className={style.arrowCandidateBag} />
            </Button>
        </div>
    );
}
