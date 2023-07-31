import React, { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import apiService from '../../../services/api/api';
import style from './FinalAppointmentsCommittee.module.css';
import StageHeader from '../../new-comp/stageHeader/StageHeader';
import RequestBar from '../../new-comp/requestBar/RequestBar';
import { STAGES_ADMIN, openApp, closeApp } from '../../../constants';

function FinalAppointmentsCommittee() {
    const stepName = 'FINAL-APPOINTMENTS-COMMITTEE';
    const openStages = useMemo(() => ['SETTING-DATE-FINAL-COMMITTEE', 'ENTER-COMMITTEE-DECISION'], []);
    const closeStages = useMemo(() => ['APPOINTMENT-COMMITTEE-WAITING'], []);
    const [render, setRender] = useState(true);
    const { formatMessage } = useIntl();
    const [openApplications, setOpenApplications] = useState([]);
    const [closeApplications, setCloseApplications] = useState([]);
    const [openAppFilter, setOpenAppFilter] = useState([]);
    const [closeAppFilter, setCloseAppFilter] = useState([]);
    const [subStageTabMap, setSubStageTabMap] = useState([STAGES_ADMIN.find(stage => stepName in stage)[stepName]]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await apiService.AdminService.getApplicationsByStep(stepName, openStages, closeStages);
                if (response && response['open'] && response['close']) {
                    setOpenApplications(openApp(response['open'], formatMessage));
                    setCloseApplications(closeApp(response['close'], formatMessage));
                    setOpenAppFilter(openApp(response['open'], formatMessage));
                    setCloseAppFilter(closeApp(response['close'], formatMessage));
                    setRender(true);
                }
            } catch (error) {}
        }

        fetchData().then(r => {});
    }, [render, closeStages, formatMessage, openStages]);

    function updateSubStageTabMap(newSubStageTabMap) {
        setSubStageTabMap(newSubStageTabMap);
    }

    return (
        <div className={style.Wrapper}>
            <StageHeader title={'ועדת מינויים סופית'} subStageTabMap={subStageTabMap} />
            <RequestBar
                setOpenAppFilter={setOpenAppFilter}
                openAppFilter={openAppFilter}
                closeAppFilter={closeAppFilter}
                setCloseAppFilter={setCloseAppFilter}
                setCloseApplications={setCloseApplications}
                closeApplications={closeApplications}
                openApplications={openApplications}
                subStageTabMap={subStageTabMap}
                setRender={setRender}
                updateSubStageTabMap={updateSubStageTabMap}
            />
        </div>
    );
}

export default FinalAppointmentsCommittee;
