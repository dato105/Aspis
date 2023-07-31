import React from 'react';
import { useIntl } from 'react-intl';
import { Button } from '@mui/material';

const ActionButton = props => {
    const { formatMessage } = useIntl();

    const handleApprove = () => {
        console.log(props.candidate);
        console.log(props.requestedRank);
        console.log('approved');
    };

    const handleDisapprove = () => {
        console.log(props.candidate);
        console.log(props.requestedRank);
        console.log('disapproved');
    };

    return (
        <div>
            <Button variant="contained" size={'small'} onClick={handleApprove}>
                {formatMessage({ id: 'actions-button.validate' })}
            </Button>
            <Button variant="contained" size={'small'} onClick={handleDisapprove}>
                {formatMessage({ id: 'actions-button.cancel' })}
            </Button>
        </div>
    );
};

export default ActionButton;
