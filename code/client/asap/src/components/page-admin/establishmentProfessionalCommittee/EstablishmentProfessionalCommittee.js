import React, { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { closeApp, openApp, STAGES_ADMIN } from '../../../constants';
import apiService from '../../../services/api/api';
import style from '../newRequest/NewRequest.module.css';
import StageHeader from '../../new-comp/stageHeader/StageHeader';
import RequestBar from '../../new-comp/requestBar/RequestBar';

function EstablishmentProfessionalCommittee() {
    const stepName = 'ESTABLISHMENT-PROFESSIONAL-COMMITTEE';
    const openStages = useMemo(
        () => [
            'LOCATING-CHAIRMAN-APPOINTMENTS-COMMITTEE',
            'ADDITION-MEMBERS-PROFESSIONAL-COMMITTEE',
            'ATTACHMENT-PROTOCOL-AND-LETTERS-APPOINTMENT',
            'SETTING-DATE-APPOINTMENTS-COMMITTEE'
        ],
        []
    );
    const closeStages = useMemo(() => ['RECEIVING-MATERIAL-CANDIDATE', 'APPOINTMENT-COMMITTEE-WAITING'], []);
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
        <div className={style.newRequestMain}>
            <StageHeader title={'הקמת ועדה מקצועית'} subStageTabMap={subStageTabMap} />
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

export default EstablishmentProfessionalCommittee;
