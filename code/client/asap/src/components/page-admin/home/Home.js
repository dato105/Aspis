import * as React from 'react';
import AlertList from '../../new-comp/alertsList/AlertList';
import AlignItemsList from '../../new-comp/candidateinprogresslist/Candidateinprogresslist';
import style from './Home.module.css';
import TaskBar from '../../new-comp/taskBar/TaskBar';
import bagImg from '../../icons/bag.png';

export default function Home() {
    const ImgBag = () => {
        return <img className={style.Img} src={bagImg} alt={'תיק'} />;
    };
    return (
        <div className={style.Home}>
            <TaskBar />
            <div className={style.AlertAndAlign}>
                <div className={style.Alert}>
                    <AlertList />
                </div>
                <div className={style.CandidateList}>
                    <AlignItemsList image={<ImgBag />} />
                </div>
            </div>
        </div>
    );
}
