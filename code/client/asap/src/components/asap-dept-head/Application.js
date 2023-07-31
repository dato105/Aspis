import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import FormControl from '@mui/material/FormControl';
import { Button } from '@mui/material';
import apiService from '../../services/api/api';
import FileSelection from '../shared/FileSelection';
import Selection from '../shared/Selection';
import { useAsapContext } from '../../services/state/AsapContextProvider';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import { ASAP_DEPT_HEAD_APPLICATIONS } from '../../services/routing/routes';
import { CURRENT_APPLICATION_KEY, NEW_APPLICATION } from '../../constants';
import rootStyle from '../../style/Asap.module.css';

const Application = () => {
    const navigate = useNavigate();
    const { formatMessage } = useIntl();
    const { asapAppointments, updateAsapAppointments } = useAsapContext();
    const [showDialog, setShowDialog] = useState(false);
    const [showDialogProgress, setShowDialogProgress] = useState(true);
    const { id } = useParams();
    const [I18nKey, setI18nKey] = useState('');
    const [stayOnPage, setStayOnPage] = useState(false);

    const [candidates, setCandidates] = useState([]);
    const [ranks, setRanks] = useState([]);
    const applicationId = parseInt(id) || NEW_APPLICATION;

    useEffect(() => {
        updateAsapAppointments({ [CURRENT_APPLICATION_KEY]: applicationId });
    }, [applicationId, updateAsapAppointments]);

    useEffect(() => {
        apiService.ApplicationService.getDeptCandidates().then(response => setCandidates(response));
        apiService.ApplicationService.getRanks().then(response => setRanks(response));
    }, []);

    const submitAppointment = () => {
        setShowDialog(true);
        setShowDialogProgress(true);
        apiService.ApplicationService.submitDeptHeadAppointment(applicationId, asapAppointments[applicationId]).then(
            response => {
                if (response === false) {
                    setStayOnPage(false);
                    setI18nKey('appointment.submit-success-message');
                } else {
                    setStayOnPage(true);
                    if (response === 'Error') {
                        setI18nKey('appointment.submit-validate-fail-message');
                    }
                    if (response === 'expired_period_time') {
                        setI18nKey('appointment.expired_period_time');
                    } else {
                        setI18nKey('appointment.submit-failed-message');
                    }
                }
                setShowDialogProgress(false);
            }
        );
    };

    const closeHandler = () => {
        setShowDialog(false);
        navigate(`/${ASAP_DEPT_HEAD_APPLICATIONS}`);
        updateAsapAppointments({ [NEW_APPLICATION]: null });
    };

    const closeHandlerApplicationExist = () => {
        setShowDialog(false);
    };

    return (
        <div className={rootStyle.appointmentContainer}>
            <FormattedMessage id={'routes.asap-dept-head-appointment'} />

            <Selection
                id={'candidateId'}
                labelI18nKey={'appointment.candidates.label'}
                labelId={'candidate-select-label'}
                options={candidates}
                optionLabelSetter={candidate => `${candidate.user.first_name} ${candidate.user.last_name}`}
                optionsValueSetter={candidate => candidate.user.id}
            />
            <Selection
                id={'requestedRankId'}
                labelI18nKey={'appointment.ranks.label'}
                labelId={'rank-select-label'}
                options={ranks}
                optionLabelSetter={rank => rank.name}
                optionsValueSetter={rank => rank.id}
            />

            <FileSelection
                id={'cv'}
                title={formatMessage({ id: 'appointment.cv.label' })}
                exampleLink={'https://drive.google.com/file/d/165LPebDq49zUPZM1dHFLQq-c9qGTZ4wQ/view?usp=sharing'}
                withTitle={true}
            />

            <FileSelection
                id={'letter'}
                title={formatMessage({ id: 'appointment.letter.label' })}
                exampleLink={'https://drive.google.com/file/d/1Ao3QYV41sGGzpgLPkEYX92Qrexm2OUAG/view?usp=sharing'}
                withTitle={true}
            />

            <FormControl sx={{ m: 1, minWidth: 120, maxWidth: 120 }}>
                <Button type="submit" variant="contained" color="success" onClick={submitAppointment}>
                    {formatMessage({ id: 'appointment.submit' })}
                </Button>
            </FormControl>

            <ConfirmationDialog
                showProgress={showDialogProgress}
                showDialog={showDialog}
                closeHandler={closeHandler}
                closeHandlerApplicationExist={closeHandlerApplicationExist}
                I18nKey={I18nKey}
                stayOnPage={stayOnPage}
            />
        </div>
    );
};

export default Application;
