import React from 'react';
import { useLocation } from 'react-router';
import { Navigate } from 'react-router-dom';
import useAuth from '../auth/hooks/useAuth';
import { LOGIN_ROUTE } from './routes';

const PrivateRoute = ({ children }) => {
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    return isAuthenticated() ? children : <Navigate to={LOGIN_ROUTE.path} state={{ from: location }} />;
};

export default PrivateRoute;
