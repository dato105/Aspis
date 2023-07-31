import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../../../services/api/api';
import { useIntl } from 'react-intl';
import style from './CandidatePage.module.css';
import CandidateHeaderPage from '../../new-comp/candidateHeaderPage/CandidateHeaderPage';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { OPTIONS, STAGES_ADMIN } from '../../../constants';
import UploadFileButton from '../../new-comp/buttons/ButtonUploadFile/UploadFileButton';
import CommitteeAppointmentButton from '../../new-comp/buttons/CommitteeAppointmentButton/CommitteeAppointmentButton';
import ButtonApprove from '../../new-comp/buttons/ButtonApprove/ButtonApprove';
import AddRecommenderButton from '../../new-comp/buttons/addRecommenderButton/AddRecommenderButton';
import LandmarkView from '../../new-comp/LandmarkView/LandmarkView';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Button from '@mui/material/Button';
import CardCandidate from '../../new-comp/cardCandidate/CardCandidate';
import Tab from '@mui/material/Tab';
import { Tabs } from '@mui/material';
import AddCommitteeCandidateButton from '../../new-comp/buttons/addCommitteeCandidateButton/AddCommitteeCandidateButton';
import TableCommittee from '../../new-comp/tableCommittee/TableCommittee';
import TableRecommenders from '../../new-comp/tableRecommenders/TableRecommenders';
import TableCandidateFiles from '../../new-comp/tableCandidateFiles/TableCandidateFiles';
import CandidateCommitteeLinearProgress from '../../new-comp/candidateCommitteeLinearProgress/CandidateCommitteeLinearProgress';
import ReminderChairmanButton from '../../new-comp/buttons/reminderChairmanButton/ReminderChairmanButton';

const CandidatePage = () => {
    const { id } = useParams();
    const { formatMessage } = useIntl();
    const [candidateDetails, setCandidateDetails] = useState([]);
    const navigate = useNavigate();
    const [subStageTabMap, setSubStageTabMap] = useState([]);
    const [render, setRender] = useState(true);
    const [matchingItem, setMatchingItem] = useState([]);
    const [showApplicationDetail, setShowApplicationDetail] = useState(false);
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [countCommitteeCand, setCountCommitteeCand] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiService.AdminService.getCandidateDetails(id);
                if (response) {
                    const name = `${response.application.applicant.user.first_name} ${response.application.applicant.user.last_name}`;
                    const image = response.application.applicant.picture_url;
                    const rank = response.application.applicant.rank.name;
                    const application_state = response.application.application_state;
                    const stageRequest = formatMessage({
                        id: `status-application.${response.step_name}`,
                    });
                    const statusRequest = formatMessage({
                        id: `appointment-steps.${response.step_name}`,
                    });
                    const stepName = response.step_name;
                    const app_id = response.application.id;
                    const idCard = response.id;
                    const desired_rank = response.application.desired_rank.name;
                    const department = response.application.applicant.department.name;
                    const employment_stage = formatMessage({
                        id: `employment-stages.${response.application.applicant.employment_stage}`,
                    });
                    const stage_due_date = new Intl.DateTimeFormat('en-GB', OPTIONS).format(
                        new Date(response.application.applicant.stage_due_date)
                    );
                    const creator_rank = response.application.creator.rank.name;
                    const step_name = response.step_name;
                    const created_date = new Intl.DateTimeFormat('en-GB', OPTIONS).format(
                        new Date(response.created_at)
                    );
                    const app_created_date = new Intl.DateTimeFormat('en-GB', OPTIONS).format(
                        new Date(response.application.created_at)
                    );
                    const department_head = `${response.application.applicant.department.department_head.first_name} ${response.application.applicant.department.department_head.last_name}`;
                    const user_id = response.application.applicant.user.id;
                    setCandidateDetails({
                        application_state,
                        name,
                        image,
                        rank,
                        stageRequest,
                        statusRequest,
                        stepName,
                        'id': idCard,
                        app_id,
                        desired_rank,
                        department,
                        employment_stage,
                        stage_due_date,
                        creator_rank,
                        created_date,
                        step_name,
                        department_head,
                        user_id,
                        app_created_date,
                    });
                    const subStage = STAGES_ADMIN.find(stage => step_name.split('/')[0] in stage);
                    setSubStageTabMap([subStage[step_name.split('/')[0]]]);
                }
            } catch (error) {}
        };

        fetchData().then(r => {});
        setRender(true);
    }, [id, formatMessage, render, countCommitteeCand]);

    useEffect(() => {
        if (subStageTabMap.length > 0) {
            const item = subStageTabMap[0].find(item => item.stepName === candidateDetails.stepName);
            setMatchingItem(item);
        }
    }, [subStageTabMap, candidateDetails]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };
    const handleGoBack = () => {
        navigate(-1);
    };
    const handleClick = event => {
        setShowApplicationDetail(previousOpen => !previousOpen);
    };
    return (
        <div>
            <div>
                <Button
                    sx={{
                        backgroundColor: 'transparent',
                        color: 'black',
                        border: 'none',
                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                    }}
                    onClick={handleGoBack}
                >
                    <ArrowForwardIosIcon fontSize="10px" />
                    {' חזור'}
                </Button>
            </div>
            <div className={style.Container}>
                <div className={style.SubContainer}>
                    <CandidateHeaderPage
                        image={candidateDetails.image}
                        rank={candidateDetails.rank}
                        name={candidateDetails.name}
                        stageRequest={candidateDetails.stageRequest}
                        statusRequest={candidateDetails.statusRequest}
                    />
                    {matchingItem?.subComponent === 'CandidateCommitteeLinearProgress' && (
                        <div className={style.InProcessCardSubCard}>
                            <div className={style.HeaderCom}>חברי ועדה</div>
                            <CandidateCommitteeLinearProgress num={countCommitteeCand} />
                        </div>
                    )}
                </div>

                {candidateDetails?.step_name !== 'FINISH' && (
                    <div className={style.Button}>
                        {matchingItem?.buttonClickAddRecommend && (
                            <AddRecommenderButton
                                title={'הוספת ממליץ'}
                                setRender={setRender}
                                card={candidateDetails}
                                stage={matchingItem}
                                userId={id}
                            />
                        )}
                        {matchingItem?.buttonClick === 'UploadFile' && (
                            <UploadFileButton
                                title={matchingItem.titleButton}
                                setRender={setRender}
                                card={candidateDetails}
                                stage={matchingItem}
                            />
                        )}
                        {matchingItem?.buttonClick === 'ReminderChairmanButton' && (
                            <ReminderChairmanButton
                                title={matchingItem.titleButton}
                                setRender={setRender}
                                render={render}
                                card={candidateDetails}
                                stage={matchingItem}
                                subStageTabMap={subStageTabMap}
                            />
                        )}
                        {matchingItem?.buttonClick === 'CommitteeAppointmentButton' && (
                            <CommitteeAppointmentButton
                                title={matchingItem.titleButton}
                                setRender={setRender}
                                card={candidateDetails}
                                stage={matchingItem}
                                subStageTabMap={subStageTabMap}
                            />
                        )}
                        {matchingItem?.buttonClick === 'ButtonApprove' && (
                            <ButtonApprove
                                title={matchingItem.titleButton}
                                setRender={setRender}
                                render={render}
                                card={candidateDetails}
                                stage={matchingItem}
                                subStageTabMap={subStageTabMap}
                            />
                        )}
                        {matchingItem?.buttonClick === 'AddCommitteeCandidateButton' && (
                            <AddCommitteeCandidateButton
                                title={matchingItem.titleButton}
                                setRender={setRender}
                                render={render}
                                card={candidateDetails}
                                stage={matchingItem}
                                subStageTabMap={subStageTabMap}
                                setOpen={setOpen}
                                open={open}
                                appID={candidateDetails.app_id}
                                setCountCommitteeCand={setCountCommitteeCand}
                            />
                        )}
                    </div>
                )}
            </div>
            <div className={style.ApplicationDetail}>
                <div
                    className={style.ButtonText}
                    variant="text"
                    sx={{
                        color: 'black',
                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                        '&.Mui-selected': {
                            backgroundColor: 'transparent',
                        },
                    }}
                    onClick={handleClick}
                >
                    {showApplicationDetail ? (
                        <div>
                            <KeyboardArrowDownIcon />
                        </div>
                    ) : (
                        <div>
                            <KeyboardArrowLeftIcon />
                        </div>
                    )}
                    <div>{'פרטי בקשה'}</div>
                </div>
                {showApplicationDetail && (
                    <div className={style.InnerButton}>
                        <CardCandidate
                            desired_rank={candidateDetails.desired_rank}
                            department={candidateDetails.department}
                            employment_stage={candidateDetails.employment_stage}
                            stage_due_date={candidateDetails.stage_due_date}
                            department_head={candidateDetails.department_head}
                            creator_rank={candidateDetails.creator_rank}
                            created_date={candidateDetails.created_date}
                        />
                        <div className={style.LandMark}>
                            <LandmarkView
                                id={id}
                                created_date={candidateDetails.app_created_date}
                            />
                        </div>
                    </div>
                )}
            </div>
            <div className={style.TabsDiv}>
                <Tabs
                    sx={{ borderBottom: 1, borderColor: '#9d9c9c', zIndex: 0 }}
                    value={activeTab}
                    onChange={handleTabChange}
                >
                    <Tab
                        label="מסמכים"
                        sx={{
                            '&.Mui-selected': {
                                color: 'black',
                            },
                        }}
                    />
                    <Tab
                        label="רשימת ממליצים"
                        sx={{
                            '&.Mui-selected': {
                                color: 'black',
                            },
                        }}
                    />
                    <Tab
                        label="וועדה מקצועית"
                        sx={{
                            '&.Mui-selected': {
                                color: 'black',
                            },
                        }}
                    />
                </Tabs>
                {activeTab === 0 && (
                    <TableCandidateFiles
                        title={'הוספת ממליץ'}
                        setRender={setRender}
                        card={candidateDetails}
                        stage={matchingItem}
                        userId={id}
                    />
                )}
                {activeTab === 1 && (
                    <TableRecommenders
                        title={'הוספת ממליץ'}
                        setRender={setRender}
                        card={candidateDetails}
                        stage={matchingItem}
                        userId={id}
                    />
                )}
                {activeTab === 2 && <TableCommittee user_id={id} />}
            </div>
        </div>
    );
};

export default CandidatePage;
