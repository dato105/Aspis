import React, { useEffect, useState } from 'react';
import { Button, TextareaAutosize } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import FormControl from '@mui/material/FormControl';
import { ASAP_ADMIN_APPLICATIONS } from '../../services/routing/routes';
import { useNavigate } from 'react-router-dom';
import rootStyle from '../../style/Asap.module.css';
import api from '../../services/api/api';

const LandingPage = () => {
    const { formatMessage } = useIntl();
    const navigate = useNavigate();
    const [newApplications, setNewApplications] = useState(0);
    const [openApplications, setOpenApplications] = useState(0);
    const [closeApplications, setCloseApplications] = useState(0);

    useEffect(() => {
        api.ApplicationService.getAdminLandingPageApplications().then(response => {
            setNewApplications(response['new'].length);
            setOpenApplications(response['open'].length);
            setCloseApplications(response['close'].length);
        });
    }, []);

    const goToApplications = () => {
        navigate(`/${ASAP_ADMIN_APPLICATIONS}`);
    };

    return (
        <div className={rootStyle.landingPageContainer}>
            <div className={rootStyle.textAreaBox}>
                <div>
                    <TextareaAutosize
                        className={rootStyle.textArea}
                        aria-label="minimum height"
                        placeholder={formatMessage({ id: 'applications.comments' })}
                        style={{ width: 100 }}
                        value={newApplications}
                        disabled={true}
                    />
                    <FormattedMessage id={'admin.new-applications'} />
                </div>
                <div>
                    <TextareaAutosize
                        className={rootStyle.textArea}
                        aria-label="minimum height"
                        placeholder={formatMessage({ id: 'applications.comments' })}
                        style={{ width: 100 }}
                        value={openApplications}
                        disabled={true}
                    />
                    <FormattedMessage id={'admin.open-applications'} />
                </div>

                <div>
                    <TextareaAutosize
                        className={rootStyle.textArea}
                        aria-label="minimum height"
                        placeholder={formatMessage({ id: 'applications.comments' })}
                        style={{ width: 100 }}
                        value={closeApplications}
                        disabled={true}
                    />
                    <FormattedMessage id={'admin.close-applications'} />
                </div>
                <div className={rootStyle.textAreaButton}>
                    <FormControl sx={{ m: 1, minWidth: 120, maxWidth: 120 }}>
                        <Button type="submit" variant="contained" color="success" onClick={goToApplications}>
                            <FormattedMessage id={'appointment.applications-view'} />
                        </Button>
                    </FormControl>
                </div>
            </div>
        </div>
    );
};
export default LandingPage;
