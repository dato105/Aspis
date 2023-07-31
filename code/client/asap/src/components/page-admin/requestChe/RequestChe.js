import React, { useEffect, useMemo, useState } from 'react';
import style from './RequestChe.module.css';
import apiService from '../../../services/api/api';
import { useIntl } from 'react-intl';
import WaitRequestCard from '../../new-comp/waitRequestCard/WaitRequestCard';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab';
import FilterReq from '../../new-comp/filterReq/FilterReq';
import img from '../../icons/filterIcon.png';
import TabPanel from '@mui/lab/TabPanel';
import { STAGES_ADMIN, OPTIONS } from '../../../constants';

function RequestChe() {
    const { formatMessage } = useIntl();
    const stepName = 'REQUEST-CHE';
    const openStages = useMemo(() => ['COMPLETING-DOCUMENTS', 'ENTER-GENERAL-ASSEMBLY-DECISION'], []);
    const closeStages = useMemo(() => [], []);
    const [openApplications, setOpenApplications] = useState([]);
    const [openAppFilter, setOpenAppFilter] = useState([]);
    const [render, setRender] = useState(true);
    const stageTabMap = [STAGES_ADMIN.find(stage => stepName in stage)[stepName]];

    useEffect(() => {
        apiService.AdminService.getApplicationsByStep(stepName, openStages, closeStages).then(response => {
            if (response && response['open']) {
                const openApp = response['open'].map((app, index) => ({
                    id: app.id,
                    application_state: app.application.application_state,
                    applicant: `${app.application.applicant.user.first_name} ${app.application.applicant.user.last_name}`,
                    desired_rank: `${app.application.desired_rank.name}`,
                    is_done: app.application.is_done,
                    stage_due_date: new Intl.DateTimeFormat('en-GB', OPTIONS).format(
                        new Date(app.application.applicant.stage_due_date)
                    ),
                    employment_stage: formatMessage({
                        id: `employment-stages.${app.application.applicant.employment_stage}`,
                    }),
                    department: `${app.application.applicant.department.name}`,
                    last_update: new Intl.DateTimeFormat('en-GB', OPTIONS).format(new Date(app.application.updated_at)),
                    wait_time: Math.round(
                        (new Date().getTime() - new Date(app.application.created_at).getTime()) / (24 * 60 * 60 * 1000)
                    ),
                    created_at: new Intl.DateTimeFormat('en-GB', OPTIONS).format(new Date(app.application.created_at)),
                    step_name: app.step_name,
                    app_id: app.application.id,
                    user_id: app.application.applicant.user.id,
                }));

                setRender(true);
                setOpenApplications(openApp);
                setOpenAppFilter(openApp);
            }
        });
    }, [render, formatMessage, openStages, closeStages]);

    const countAppInStages = () => {
        const subStageTabMap = stageTabMap[0].map(stage => {
            let count = openApplications.filter(app => app.step_name === stage.stepName).length;
            stage.count = count;
            return stage;
        });
        return subStageTabMap;
    };

    const tab = () => {
        return (
            <div>
                {stageTabMap[0].map((stage, index) => {
                    return (
                        <div key={index}>
                            <div className={style.requestBarSubHeader}>{stage.header}</div>
                            {openAppFilter.map((app, index) => {
                                if (app.step_name === stage.stepName) {
                                    return (
                                        <WaitRequestCard
                                            key={index}
                                            subStageTabMap={stageTabMap[0]}
                                            subComponent={app.subComponent}
                                            stage={stage}
                                            card={app}
                                            handleClickBtn={countAppInStages}
                                            setRender={setRender}
                                        />
                                    );
                                }
                                return null;
                            })}
                        </div>
                    );
                })}
            </div>
        );
    };

    function filterByTypeReq(typeReq) {
        const step_name = stageTabMap[0].filter(item => typeReq.includes(item.header));
        setOpenAppFilter(openApplications.filter(item => step_name.find(obj => obj.stepName === item.step_name)));
    }

    return (
        <div>
            <h1 className={style.Title}>{'בקשות מל"ג'}</h1>
            <Box sx={{ width: '90%', typography: 'body1' }}>
                <TabContext value={'1'}>
                    <Box className={style.tabContext} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList textColor="inherit" className={style.tabList} aria-label="lab API tabs example">
                            <Tab
                                className={style.tab}
                                label="בקשות שממתינות לטיפולך"
                                icon={<p className={style.CountAlertFilled}>{openAppFilter.length}</p>}
                                value="1"
                            />
                        </TabList>
                        <div>
                            <FilterReq
                                filterBy={'סנן לפי סטטוס בקשה'}
                                subStageTabMap={countAppInStages}
                                filterByTypeReq={filterByTypeReq}
                                flag={false}
                                stages={stageTabMap[0].map(stage => stage.header)}
                                type={'סנן בקשות'}
                                iconClose={<img className={style.searchIcon} src={img} alt={'סגור'} />}
                                iconOpen={<img className={style.searchIcon} src={img} alt={'פתוח'} />}
                            />
                        </div>
                        <div className={style.bottomLine}></div>
                    </Box>
                    <TabPanel value="1">{tab()}</TabPanel>
                </TabContext>
            </Box>
        </div>
    );
}

export default RequestChe;
