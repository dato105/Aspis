import styles from "./LandmarkView.module.css";
import {useEffect, useState} from "react";
import apiService from "../../../services/api/api";
import { OPTIONS, STAGES_ADMIN,committeeType } from '../../../constants';



export default function LandmarkView(props) {
        const [timeLineData, setTimeLineData] = useState([])
        const {id,created_date } = props

        useEffect(() => {
            const fetchData = async () => {
                try {
                    let response = await apiService.AdminService.getApplicationSteps(id);

                    if (response) {
                        let steps = [];
                       response = response.filter((timelineItem) => {
                            for (const stage of STAGES_ADMIN) {
                                for (const subStage of stage[Object.keys(stage)[0]]) {
                                    if (subStage.stepName === timelineItem.step_name ) {
                                        if (subStage.hasOwnProperty('buttonClick') && subStage.buttonClick === 'CommitteeAppointmentButton') {
                                            const newObj = {
                                                offset: 0,
                                                text: subStage.header,
                                                date: new Intl.DateTimeFormat('en-GB', OPTIONS).format(new Date(timelineItem.updated_at)),
                                                isActive: true
                                            };
                                            steps.push(newObj);
                                           return false
                                        } else {
                                            return true;
                                        }
                                    }
                                }
                            }
                            return timelineItem;
                        });

                        let committees = await apiService.AdminService.getCommitteesDates(steps);

                        steps = steps.map((step, index) => {

                            step.offset = 0;
                            step.text = committeeType[index];
                            step.date = new Intl.DateTimeFormat('en-GB', OPTIONS).format(new Date(committees[index].committee_date));
                            return step;
                        });

                        let newObj = {
                            offset: 0,
                            text: "פתיחת בקשה",
                            date: created_date,
                            isActive: true
                        };
                        steps.push(newObj);

                        for (let i = 0; i < response.length; i++) {
                            for (const stage of STAGES_ADMIN) {
                                for (const subStage of stage[Object.keys(stage)[0]]) {

                                    if (subStage.nextStepName === response[i].step_name ) {
                                        const newObj = {
                                            offset: 0,
                                            text: subStage.header,
                                            date: new Intl.DateTimeFormat('en-GB', OPTIONS).format(new Date(response[i].created_at)),
                                            isActive: false
                                        };
                                        steps.push(newObj);
                                    }
                                }
                            }
                        }
                            steps.sort((a, b) => {
                                const dateA = new Date(a.date.split('/').reverse().join('/'));
                                const dateB = new Date(b.date.split('/').reverse().join('/'));
                                return dateA.getTime() - dateB.getTime();

                        });
                        steps = steps.map((step, index) => {
                            step.offset = index * 60;
                            return step;
                        });
                        setTimeLineData(steps);

                    }
                } catch (error) {
                    console.log('Error:', error);
                }
            };

            fetchData().then(r => {});
        }, [id,created_date]);

        const handleItemClick = (index) => {
            const updatedTimeLineData = [...timeLineData];
            if( updatedTimeLineData[index].isExpanded)
                updatedTimeLineData[index].clicked = true;
            setTimeLineData(updatedTimeLineData);
        };
        const omMouseHover = (index) => {
            const updatedTimeLineData = [...timeLineData];
            if(  !updatedTimeLineData[index].isExpanded)
            updatedTimeLineData[index].isExpanded = true;
            setTimeLineData(updatedTimeLineData);
        };
    const omMouseLeave = (index) => {
        const updatedTimeLineData = [...timeLineData];
        if(   !updatedTimeLineData[index].clicked )
            updatedTimeLineData[index].isExpanded = false;
        setTimeLineData(updatedTimeLineData);
    };



    return (
        <div className={styles.LandmarkView}>
            <div className={styles.headerLandMarkView}>ציר זמן בקשה</div>
            <div className={styles.timelineContainer}>
                {timeLineData?.map((timelineItem, index) => {
                    return ((timelineItem.isActive? (
                            <div
                                key={index}
                                className={styles.timelineItemActive}
                                style={{transform: `translate(-${timelineItem.offset}px)`}}
                            >
                                <label className={styles.timelineItemLabel}>{timelineItem.text}</label>
                                <label className={styles.timelineItemDate}>{timelineItem.date}</label>
                            </div>
                    ) : (<div
                            key={index}
                            className={styles.timelineItemNotActive}
                            style={{transform: `translate(-${timelineItem.offset}px)`}}
                            onClick={() => handleItemClick(index)}
                            onMouseOver={() => omMouseHover(index)}
                            onMouseLeave={() => omMouseLeave(index)}
                        >
                            <div className={styles.timelineItemContent} style={{ display: timelineItem.isExpanded ? 'block' : 'none' }}>
                                <label className={styles.timelineItemLabel}>{timelineItem.text}</label>
                                <label className={styles.timelineItemDate}>{timelineItem.date}</label>
                            </div>
                        </div>)
                ) );
                })}
            </div>
        </div>
    );
}