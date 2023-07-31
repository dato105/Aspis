import * as React from 'react';
import style from './TaskBar.module.css';
import TaskSquare from "./TaskSquare";
import DateCommit from "./DateCommit";
import {useAsapContext} from "../../../services/state/AsapContextProvider";

export default function TaskBar() {
    const {asapCountApplication } = useAsapContext();
    return (
        <div className={style.taskBarBox}>
            <TaskSquare num={asapCountApplication?.newRequests} name ={'בקשות חדשות'} />
            <TaskSquare num={asapCountApplication?.openProcess} name ={'פתיחת תהליך'}/>
            <TaskSquare num={asapCountApplication?.establishmentProfessionalCommittee} name ={'הקמת וועדה מקצועית'}/>
            <TaskSquare num={asapCountApplication?.professionalCommittee} name ={'ועדה מקצועית'}/>
            <TaskSquare num={asapCountApplication?.finalAppointmentsCommittee} name ={'ועדה מנויים סופית'}/>
            <TaskSquare num={asapCountApplication?.RequestCHE} name ={'בקשות למלג'}/>
            <DateCommit date = { asapCountApplication?.nearestCommittee} />

        </div>

    );
}