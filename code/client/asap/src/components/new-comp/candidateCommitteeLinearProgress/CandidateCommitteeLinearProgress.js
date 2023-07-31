import React from 'react';
import style from './CandidateCommitteeLinearProgress.module.css'

const CandidateCommitteeLinearProgress = ({ num }) => {
    return (
        <div className={style.subComponent}>
        <div className={style.progressBarContainer}>
            {num === 1 && <div className={style.progressBarFilled} />}
        </div>
                <div className={style.candidatesNum}>{num}/2</div>
        </div>

    );
};

export default CandidateCommitteeLinearProgress;