import style from '../waitRequestCard/WaitRequestCard.module.css';
import React from 'react';

function CardCandidate(props) {
    return (
        <div className={style.bottomCard}>
            <div className={style.bottomCardText}>
                <div className={style.InProcessCardSubCard}>
                    <div className={style.subHeader}> דרגה נוכחית</div>
                    <div className={style.parameter}>{props.desired_rank}</div>
                </div>
                <div className={style.InProcessCardSubCard}>
                    <div className={style.subHeader}> מחלקה</div>
                    <div className={style.parameter}>{props.department}</div>
                </div>
                <div className={style.InProcessCardSubCard}>
                    <div className={style.subHeader}>שלב העסקה</div>
                    <div className={style.parameter}>{props.employment_stage}</div>
                </div>
                <div className={style.InProcessCardSubCard}>
                    <div className={style.subHeader}> תאריך סיום שלב</div>
                    <div className={style.parameter}>{props.stage_due_date}</div>
                </div>
                <div className={style.InProcessCardSubCard}>
                    <div className={style.subHeader}> מקים בקשה</div>
                    <div className={style.parameter}>{props.creator_rank}</div>
                </div>
                <div className={style.InProcessCardSubCard}>
                    <div className={style.subHeader}>{'שם רמ"ח'}</div>
                    <div className={style.parameter}>{props.department_head}</div>
                </div>
                <div className={style.InProcessCardSubCard}>
                    <div className={style.subHeader}> תאריך פתיחת בקשה</div>
                    <div className={style.parameter}>{props.created_date}</div>
                </div>
            </div>
        </div>
    );
}

export default CardCandidate;
