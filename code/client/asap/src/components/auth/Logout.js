import { Button } from '@mui/material';
import useAuth from '../../services/auth/hooks/useAuth';
import style from './Logout.module.css';
import { useIntl } from 'react-intl';

const Logout = () => {
    const { formatMessage } = useIntl();
    const { logout } = useAuth();

    return (
        <div className={style.logoutContainer}>
            <Button variant="outlined" onClick={logout}>
                {formatMessage({ id: 'logout.text' })}
            </Button>
        </div>
    );
};

export default Logout;
