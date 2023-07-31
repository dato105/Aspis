import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import FormControl from '@mui/material/FormControl';
import { Button, Link } from '@mui/material';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import { CURRENT_APPLICATION_KEY, NEW_APPLICATION } from '../../constants';
import useApplications from '../../hooks/useApplications';
import apiService from '../../services/api/api';
import rootStyle from '../../style/Asap.module.css';
import { downloadFile } from '../../services/utils';
import { ASAP_QUALITY_DEPT_APPLICATIONS } from '../../services/routing/routes';
import FileSelection from '../shared/FileSelection';
import AddIcon from '@mui/icons-material/Add';

const Application = () => {
    const { formatMessage } = useIntl();
    const navigate = useNavigate();
    const [showDialog, setShowDialog] = useState(false);
    const [showDialogProgress, setShowDialogProgress] = useState(true);
    const [I18nKey, setI18nKey] = useState('');
    const { currentApplicationState: applicationState, asapAppointments, updateAsapAppointments } = useApplications();
    const { id } = useParams();
    const applicationId = parseInt(id) || NEW_APPLICATION;
    const [docsList, setDocsList] = useState([]);
    const MAX_DOCS = 4;

    useEffect(() => {
        updateAsapAppointments({ [CURRENT_APPLICATION_KEY]: applicationId });
    }, [applicationId, updateAsapAppointments]);

    const getCv = () => {
        downloadFile(apiService.ApplicationService.getCv, applicationId, applicationState?.cvFileName);
    };

    const getLetter = () => {
        downloadFile(apiService.ApplicationService.getLetter, applicationId, applicationState?.letterFileName);
    };

    const handleDocAdd = () => {
        setDocsList([...docsList, { doc: '' }]);
    };

    const updateCurrentState = response => {
        updateAsapAppointments({
            [applicationId]: {
                ...applicationState,
                'stepName': formatMessage({ id: `appointment-steps.${response}` }),
            },
        });
    };

    const handleAppointment = () => {
        setShowDialog(true);
        setShowDialogProgress(true);
        apiService.ApplicationService.submitQualityDeptAppointment(
            applicationId,
            asapAppointments[applicationId],
            docsList.length
        ).then(response => {
            updateCurrentState(response);
            setI18nKey('appointment.submit-success-message');
            setShowDialogProgress(false);
        });
    };

    const submitAppointment = e => {
        handleAppointment(e.target.name);
    };

    const closeHandler = () => {
        setShowDialog(false);
        navigate(`/${ASAP_QUALITY_DEPT_APPLICATIONS}`);
        updateAsapAppointments({ [NEW_APPLICATION]: null });
    };

    return (
        <div className={rootStyle.appointmentContainer}>
            <FormattedMessage id={'routes.asap-dept-head-appointment-edit'} />
            <div className={rootStyle.appointmentFormContainer}>
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
                <div className={rootStyle.spanTwoColumns}>
                    <Link component="button" variant="body2" onClick={getCv}>
                        {applicationState?.cvFileName}
                    </Link>
                </div>

                <div>
                    <FormattedMessage id={'applications.letter-file-name'} />:
                </div>
                <div className={rootStyle.spanTwoColumns}>
                    <Link component="button" variant="body2" onClick={getLetter}>
                        {applicationState?.letterFileName}
                    </Link>
                </div>

                <div>
                    <FormattedMessage id={'applications.teaching-feedback'} />:
                </div>
                <div className={rootStyle.spanTwoColumns}>
                    <FileSelection id={'teaching-feedback'} withTitle={false} />
                </div>

                {React.Children.toArray(
                    docsList?.map((singleDoc, index) => (
                        <>
                            <div>
                                <FormattedMessage id={'applications.another-docs'} />:
                            </div>
                            <div className={rootStyle.spanTwoColumns}>
                                <FileSelection id={`doc${index}`} withTitle={false} />
                            </div>
                        </>
                    ))
                )}

                {docsList.length < MAX_DOCS && (
                    <>
                        <div>
                            <FormattedMessage id={'applications.click-to-add'} />:
                        </div>
                        <div className={rootStyle.spanTwoColumns}>
                            <AddIcon className={rootStyle.icon} onClick={handleDocAdd} />
                        </div>
                    </>
                )}

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
                I18nKey={I18nKey}
            />
        </div>
    );
};

export default Application;
