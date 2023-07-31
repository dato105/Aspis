import React, { useState } from 'react';
import style from './WaitRequestCard.module.css';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import Button from '@mui/material/Button';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import style2 from '../InProcessCard/InProcessCard.module.css';
import ListRecommendationsButton from '../buttons/buttuonListRecommendations/ListRecommendationsButton';
import RequirementForRepaerINote from '../RequirementForRepaerINote/RequirementForRepaerINote';
import img from '../../icons/candidateBag.png';
import UploadFileButton from '../buttons/ButtonUploadFile/UploadFileButton';
import ButtonApprove from '../buttons/ButtonApprove/ButtonApprove';
import NewRequestFilesBtn from '../buttons/NewRequestFilesBtn/NewRequestFilesBtn';
import CommitteeAppointmentButton from '../buttons/CommitteeAppointmentButton/CommitteeAppointmentButton';
import { useNavigate } from 'react-router-dom';
import { ASAP_ADMIN_CANDIDATE_PAGE } from '../../../services/routing/routes';
import ReminderChairmanButton from '../buttons/reminderChairmanButton/ReminderChairmanButton';
import AddCommitteeCandidateButton from '../buttons/addCommitteeCandidateButton/AddCommitteeCandidateButton';
import CandidateCommitteeLinearProgress from '../candidateCommitteeLinearProgress/CandidateCommitteeLinearProgress';
import apiService from "../../../services/api/api";

function WaitRequestCard(props) {
    const { card, stage, setRender, subStageTabMap, render } = props;
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [countCommitteeCand, setCountCommitteeCand] = useState(0);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClick2 = () => {
        apiService.AdminService.updateApplicationStep(stage.nextStepName, card.app_id, 1, card.id).then(
            response => response.data
        );
        setRender(false);
    };

    return (
        <div className={style.waitRequestCard}>
            <div className={style.topCard}>
                <div className={style.candidateName}>{card.applicant}</div>
                <Button
                    className={style.candidateBagBtn}
                    onClick={() => {
                        navigate(`/${ASAP_ADMIN_CANDIDATE_PAGE}/${card.user_id}`);
                    }}
                >
                    <img src={img} className={style.candidateBag} alt={'מועמד'} />
                    תיק מועמד
                    <ArrowBackIosOutlinedIcon />
                </Button>
            </div>
            <div className={style.bottomLine}></div>
            <div className={style.bottomCard}>
                <div className={style.bottomCardText}>
                    <div className={style.InProcessCardSubCard}>
                        <div className={style.subHeader}> דרגה מבוקשת</div>
                        <div className={style.parameter}>{card.desired_rank}</div>
                    </div>
                    <div className={style.InProcessCardSubCard}>
                        <div className={style.subHeader}> מחלקה</div>
                        <div className={style.parameter}>{card.department}</div>
                    </div>
                    <div className={style.InProcessCardSubCard}>
                        <div className={style.subHeader}>שלב העסקה</div>
                        <div className={style.parameter}>{card.employment_stage}</div>
                    </div>
                    <div className={style.InProcessCardSubCard}>
                        <div className={style.subHeader}> תאריך סיום שלב</div>
                        <div className={style.parameter}>{card.stage_due_date}</div>
                    </div>
                    <div className={style.InProcessCardSubCard}>
                        <div className={style.subHeader}>
                            עודכן לאחרונה
                            <ErrorOutlineOutlinedIcon className={style2.errorIcon}></ErrorOutlineOutlinedIcon>
                        </div>
                        <div className={style.parameter}>{card.last_update}</div>
                    </div>
                    <div>
                        {stage.subComponent === 'NewRequestFilesBtn' && (
                            <NewRequestFilesBtn files={card.application_state[0]} />
                        )}
                    </div>
                    <div>
                        {stage.subComponent === 'CandidateCommitteeLinearProgress' && (
                            <div className={style.InProcessCardSubCard}>
                                <div className={style.subHeader}>חברי ועדה</div>
                                <CandidateCommitteeLinearProgress num={countCommitteeCand} />
                            </div>
                        )}
                    </div>
                </div>
                <div className={style.InProcessCardSubCard2}>
                <Button variant="text" onClick={handleClick2}></Button>
                </div>
                <div className={style.InProcessCardSubCardButton}>
                    <div>
                        {stage.buttonClick === 'UploadFile' && (
                            <UploadFileButton
                                title={stage.titleButton}
                                setRender={setRender}
                                card={card}
                                stage={stage}
                            />
                        )}
                        {stage.buttonClick === 'ListRecommendations' && (
                            <ListRecommendationsButton
                                title={stage.titleButton}
                                setRender={setRender}
                                card={card}
                                stage={stage}
                            />
                        )}
                        {stage.buttonClick === 'CommitteeAppointmentButton' && (
                            <CommitteeAppointmentButton
                                title={stage.titleButton}
                                setRender={setRender}
                                card={card}
                                stage={stage}
                                render={render}
                                subStageTabMap={subStageTabMap}
                                setOpen={setOpen}
                                open={open}
                            />
                        )}
                        {stage.buttonClick === 'ButtonApprove' && (
                            <ButtonApprove
                                title={stage.titleButton}
                                setRender={setRender}
                                card={card}
                                stage={stage}
                                subStageTabMap={subStageTabMap}
                            />
                        )}
                        {stage.buttonClick === 'ReminderChairmanButton' && (
                            <ReminderChairmanButton
                                title={stage.titleButton}
                                setRender={setRender}
                                render={render}
                                card={card}
                                stage={stage}
                                subStageTabMap={subStageTabMap}
                            />
                        )}
                        {stage.buttonClick === 'AddCommitteeCandidateButton' && (
                            <AddCommitteeCandidateButton
                                title={stage.titleButton}
                                setRender={setRender}
                                card={card}
                                stage={stage}
                                subStageTabMap={subStageTabMap}
                                setOpen={setOpen}
                                open={open}
                                appID={card.app_id}
                                setCountCommitteeCand={setCountCommitteeCand}
                            />
                        )}
                    </div>
                    {stage.buttonNeededRepair ? (
                        <div>
                            <Button
                                className={style.waitRequestDeniedBtn}
                                onClick={() => handleClick()}
                                disableElevation
                            >
                                <div className={style.deniedBtnText}>דרוש תיקון</div>
                            </Button>
                            <RequirementForRepaerINote
                                setOpenNote={setOpen}
                                openNote={open}
                                appID={card.app_id}
                                stage={stage}
                            />
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
}

export default WaitRequestCard;
