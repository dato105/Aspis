import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from '@mui/material';

const SidebarItem = ({ i18nId }) => {
    return (
        <Button variant="contained">
            <FormattedMessage id={i18nId} />
        </Button>
    );
};

export default SidebarItem;
