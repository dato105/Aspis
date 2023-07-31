import React, { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import apiService from '../../../services/api/api';
import style from '../FinalAppointmentsCommittee/FinalAppointmentsCommittee.module.css';
import StageHeader from '../../new-comp/stageHeader/StageHeader';
import RequestBar from '../../new-comp/requestBar/RequestBar';
import { STAGES_ADMIN, openApp, closeApp } from '../../../constants';

function ProfessionalCommittee() {
    const stepName = 'PROFESSIONAL-COMMITTEE';
    const openStages = useMemo(() => ['CONTACT-RECOMMENDERS -AND-ATTACHING-LETTERS-RECOMMENDATION'], []);
    const closeStages = useMemo(() => ['DETERMINE-PROFESSIONAL-COMMITTEE-REPORT-RECOMMENDATIONS'], []);
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
            <StageHeader title={'ועדה מקצועית'} subStageTabMap={subStageTabMap} />
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

export default ProfessionalCommittee;
