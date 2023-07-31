import React from 'react';
import style from '../Button.module.css';
import IconButton from '@mui/material/IconButton';
import recommendationImg from '../../../icons/recommendation.png';
import { ASAP_ADMIN_CANDIDATE_PAGE } from '../../../../services/routing/routes';
import { useNavigate } from 'react-router-dom';

function ListRecommendationsButton(props) {
    const { card, title } = props;
    const navigate = useNavigate();

    return (
        <div className={style.InProcessCardSubCardButton}>
            <IconButton
                className={style.waitRequestApproveBtn}
                variant="contained"
                onClick={() => navigate(`/${ASAP_ADMIN_CANDIDATE_PAGE}/${card.user_id}`)}
            >
                <img src={recommendationImg} alt={'ממליץ'} />
                <div className={style.approveBtnText}>{title}</div>
            </IconButton>
        </div>
    );
}

export default ListRecommendationsButton;