import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, TextareaAutosize, Link, FormControl } from '@mui/material';
import { CURRENT_APPLICATION_KEY, NEW_APPLICATION } from '../../constants';
import useApplications from '../../hooks/useApplications';
import apiService from '../../services/api/api';
import rootStyle from '../../style/Asap.module.css';
import { downloadFile } from '../../services/utils';
import BelowCv from '../shared/BelowCv';
import { ASAP_DEPT_MEMBER_EDIT_APPLICATION } from '../../services/routing/routes';

const ApplicationView = () => {
    const { formatMessage } = useIntl();
    const navigate = useNavigate();
    const { currentApplicationState: applicationState, updateAsapAppointments } = useApplications();
    const { id } = useParams();
    const applicationId = parseInt(id) || NEW_APPLICATION;
    const [canEdit, setCanEdit] = useState(false);

    useEffect(() => {
        updateAsapAppointments({ [CURRENT_APPLICATION_KEY]: applicationId });
    }, [applicationId, updateAsapAppointments]);

    const getCv = () => {
        downloadFile(apiService.ApplicationService.getCv, applicationId, applicationState?.cvFileName);
    };

    const getLetter = () => {
        downloadFile(apiService.ApplicationService.getLetter, applicationId, applicationState?.letterFileName);
    };

    useEffect(() => {
        if (applicationState?.stepName === formatMessage({ id: 'appointment-steps.DEPT_HEAD_FEEDBACK' })) {
            setCanEdit(true);
        } else {
            setCanEdit(false);
        }
    }, [applicationState, formatMessage]);

    const navigateToEdit = () => {
        navigate(`/${ASAP_DEPT_MEMBER_EDIT_APPLICATION}/${applicationId}`);
    };

    return (
        <div className={rootStyle.appointmentContainer}>
            <h2>
                {' '}
                <FormattedMessage id={'routes.asap-appointment-view'} />
            </h2>

            <div className={rootStyle.status}>
                <FormattedMessage id={'applications.status'} />:
                <div className={rootStyle.statusInner}>{applicationState?.stepName}</div>
            </div>

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
                        disabled={true}
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
                        disabled={true}
                    />
                </div>
                <BelowCv applicationState={applicationState} />

                <FormControl sx={{ m: 1, minWidth: 120, maxWidth: 120 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        size="medium"
                        color="success"
                        disabled={!canEdit}
                        onClick={navigateToEdit}
                    >
                        <FormattedMessage id={'actions-button.editText'} />
                    </Button>
                </FormControl>
            </div>
        </div>
    );
};

export default ApplicationView;
