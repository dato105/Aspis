import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useAsapContext } from '../../state/AsapContextProvider';
import { removeFromLocalStorage, STORAGE_ASAP_AUTH_STATE } from '../../storage/storage';
import apiService from '../../api/api';

const useAuth = () => {
    const navigate = useNavigate();
    const {
        asapAuth,
        asapUser: { roles },
        initAsapUser,
    } = useAsapContext();

    const primaryRole = roles && roles[0];

    const hasToken = asapAuth?.token;

    const expires = asapAuth?.exp || 0;
    const delta = new Date(expires * 1000) - new Date();
    const isTokenValid = delta > 0;

    const isAuthenticated = useCallback(() => hasToken && isTokenValid, [hasToken, isTokenValid]);

    const logout = () => {
        apiService.AuthService.logout().then(() => {
            removeFromLocalStorage(STORAGE_ASAP_AUTH_STATE);
            initAsapUser();
            navigate('login');
        });
    };

    return { isAuthenticated, logout, primaryRole };
};

export default useAuth;
