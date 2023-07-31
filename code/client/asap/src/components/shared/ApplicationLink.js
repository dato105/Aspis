import React from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Button } from '@mui/material';

const ApplicationLink = ({ applicationId, canUpdate, wantedRoute, actionsButton }) => {
    const { formatMessage } = useIntl();

    return (
        <Link
            to={`/${wantedRoute}/${applicationId}`}
            style={{ textDecoration: 'none', pointerEvents: canUpdate ? '' : 'none' }}
        >
            <Button variant="contained" size={'small'} disabled={!canUpdate}>
                {formatMessage({ id: actionsButton })}
            </Button>
        </Link>
    );
};

export default ApplicationLink;
