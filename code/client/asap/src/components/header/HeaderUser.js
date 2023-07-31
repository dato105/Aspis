import React from 'react';
import { useIntl } from 'react-intl';
import { useAsapContext } from '../../services/state/AsapContextProvider';

const HeaderUser = () => {
    const { asapUser } = useAsapContext();
    const { formatMessage } = useIntl();

    return (
        <label>
            {formatMessage({ id: 'header.user.message' })}: {asapUser?.first_name} {asapUser?.last_name}
        </label>
    );
};

export default HeaderUser;
