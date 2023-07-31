import React, { useEffect, useState } from 'react';
import rootStyle from '../../style/Asap.module.css';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Link, TextareaAutosize } from '@mui/material';
import BelowCv from '../shared/BelowCv';
import FormControl from '@mui/material/FormControl';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import { ASAP_DEPT_MEMBER_APPLICATION_VIEW } from '../../services/routing/routes';
import { CURRENT_APPLICATION_KEY, NEW_APPLICATION } from '../../constants';
import apiService from '../../services/api/api';
import { useNavigate, useParams } from 'react-router-dom';
import useApplications from '../../hooks/useApplications';
import { downloadFile } from '../../services/utils';
import FileSelection from '../shared/FileSelection';

const EditApplication = () => {
    const { formatMessage } = useIntl();
    const navigate = useNavigate();
    const [showDialog, setShowDialog] = useState(false);
    const [showDialogProgress, setShowDialogProgress] = useState(true);
    const [textMessage, setTextMessage] = useState('Error');
    const [validationError, setValidationError] = useState(false);
    const { currentApplicationState: applicationState, asapAppointments, updateAsapAppointments } = useApplications();
    const { id } = useParams();
    const applicationId = parseInt(id) || NEW_APPLICATION;

    useEffect(() => {
        updateAsapAppointments({ [CURRENT_APPLICATION_KEY]: applicationId });
    }, [applicationId, updateAsapAppointments]);

    const getCv = () => {
        downloadFile(apiService.ApplicationService.getCv, applicationId, applicationState?.cvFileName);
    };

    const getLetter = () => {
        downloadFile(apiService.ApplicationService.getLetter, applicationId, applicationState?.letterFileName);
    };

    const updateCvComments = event => {
        updateAsapAppointments({ [applicationId]: { ...applicationState, 'cvComments': event.target.value } });
    };

    const updateLetterComments = event => {
        updateAsapAppointments({ [applicationId]: { ...applicationState, 'letterComments': event.target.value } });
    };

    const updateCurrentState = response => {
        updateAsapAppointments({
            [applicationId]: {
                ...applicationState,
                'stepName': formatMessage({ id: `appointment-steps.${response['step']}` }),
                'cvFileName': response['cv_name'],
                'letterFileName': response['letter_name'],
            },
        });
    };

    const submitAppointment = () => {
        setShowDialog(true);
        setShowDialogProgress(true);
        apiService.ApplicationService.handleDeptMemberAppointment(applicationId, asapAppointments[applicationId]).then(
            response => {
                setShowDialogProgress(false);
                if (response === true) {
                    setValidationError(true);
                    setTextMessage('appointment.submit-validate-fail-message');
                } else {
                    setValidationError(false);
                    updateCurrentState(response);
                    setTextMessage('appointment.submit-success-message');
                }
            }
        );
    };

    const closeHandler = () => {
        setShowDialog(false);
        if (!validationError) {
            navigate(`/${ASAP_DEPT_MEMBER_APPLICATION_VIEW}/${applicationId}`);
            updateAsapAppointments({ [NEW_APPLICATION]: null });
        }
    };

    return (
        <div className={rootStyle.appointmentContainer}>
            <FormattedMessage id={'routes.asap-dept-member-edit-appointment'} />
            <div className={rootStyle.appointmentFormContainer}>
                <div>
                    <FormattedMessage id={'applications.responsible'} />:
                </div>
                <div className={rootStyle.spanTwoColumns}>{applicationState?.creatorName}</div>

                <div>
                    <FormattedMessage id={'applications.candidate'} />:
                </div>
                <div className={rootStyle.spanTwoColumns}>{applicationState?.candidateName}</div>

                <div>
                    <FormattedMessage id={'applications.rank'} />:
                </div>
                <div className={rootStyle.spanTwoColumns}>{applicationState?.requestedRankName}</div>

                <div>
                    <FormattedMessage id={'applications.cv-file-name'} />:
                </div>
                <div>
                    <Link component="button" variant="body2" onClick={getCv}>
                        {applicationState?.cvFileName}
                    </Link>
                </div>
                <div>
                    <TextareaAutosize
                        aria-label="minimum height"
                        minRows={5}
                        placeholder={formatMessage({ id: 'applications.comments' })}
                        style={{ width: 300 }}
                        value={applicationState?.cvComments || ''}
                        onChange={updateCvComments}
                    />
                </div>

                <div className={rootStyle.spanTwoColumns}>
                    <FileSelection
                        id={'cv'}
                        title={formatMessage({ id: 'appointment.cv.change' })}
                        exampleLink={
                            'https://drive.google.com/file/d/165LPebDq49zUPZM1dHFLQq-c9qGTZ4wQ/view?usp=sharing'
                        }
                    />
                </div>

                <div>
                    <FormattedMessage id={'applications.letter-file-name'} />:
                </div>
                <div>
                    <Link component="button" variant="body2" onClick={getLetter}>
                        {applicationState?.letterFileName}
                    </Link>
                </div>
                <div>
                    <TextareaAutosize
                        aria-label="minimum height"
                        minRows={5}
                        placeholder={formatMessage({ id: 'applications.comments' })}
                        style={{ width: 300 }}
                        value={applicationState?.letterComments || ''}
                        onChange={updateLetterComments}
                    />
                </div>
                <div className={rootStyle.spanTwoColumns}>
                    <FileSelection
                        id={'letter'}
                        title={formatMessage({ id: 'appointment.letter.change' })}
                        exampleLink={
                            'https://drive.google.com/file/d/1Ao3QYV41sGGzpgLPkEYX92Qrexm2OUAG/view?usp=sharing'
                        }
                    />
                </div>

                <BelowCv applicationState={applicationState} />

                <FormControl sx={{ m: 1, minWidth: 120, maxWidth: 120 }}>
                    <Button type="submit" variant="contained" color="success" name="submit" onClick={submitAppointment}>
                        <FormattedMessage id={'appointment.submit'} />
                    </Button>
                </FormControl>
            </div>

            <ConfirmationDialog
                showProgress={showDialogProgress}
                showDialog={showDialog}
                closeHandler={closeHandler}
                I18nKey={textMessage}
            />
        </div>
    );
};

export default EditApplication;
