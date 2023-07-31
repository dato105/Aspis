import React, { useEffect, useMemo, useState } from 'react';
import StageHeader from '../../new-comp/stageHeader/StageHeader';
import RequestBar from '../../new-comp/requestBar/RequestBar';
import style from './OpeningProcess.module.css';
import apiService from '../../../services/api/api';
import { useIntl } from 'react-intl';
import { STAGES_ADMIN, openApp, closeApp } from '../../../constants';

function OpeningProcess() {
    const stepName = 'OPEN-PROCESS';
    const openStages = useMemo(
        () => ['SETTING-DATE-APPOINTMENT-COMMITTEE', 'ENTER-APPOINTMENT-COMMITTEE-DECISION'],
        []
    );
    const closeStages = useMemo(() => ['APPOINTMENT-COMMITTEE-WAITING'], []);
    const [openApplications, setOpenApplications] = useState([]);
    const [closeApplications, setCloseApplications] = useState([]);
    const [openAppFilter, setOpenAppFilter] = useState([]);
    const [closeAppFilter, setCloseAppFilter] = useState([]);
    const { formatMessage } = useIntl();
    const [render, setRender] = useState(true);
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
        <div className={style.openingProcessMain}>
            <StageHeader title={'פתיחת תהליך'} subStageTabMap={subStageTabMap} />
            <RequestBar
                setOpenAppFilter={setOpenAppFilter}
                openAppFilter={openAppFilter}
                closeAppFilter={closeAppFilter}
                setCloseAppFilter={setCloseAppFilter}
                closeApplications={closeApplications}
                openApplications={openApplications}
                subStageTabMap={subStageTabMap}
                updateSubStageTabMap={updateSubStageTabMap}
                setRender={setRender}
                render={render}
            />
        </div>
    );
}

export default OpeningProcess;
