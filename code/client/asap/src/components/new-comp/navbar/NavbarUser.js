import React from 'react';
import { useAsapContext } from '../../../services/state/AsapContextProvider';

const NavbarUser = () => {
    const { asapUser } = useAsapContext();

    return (
        <label >
            {asapUser?.first_name} {asapUser?.last_name}
        </label>
    );
};

export default NavbarUser;
