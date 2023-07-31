import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/auth/Login';
import PrivateRoute from './services/routing/PrivateRoute';
import BaseLayout from './layouts/BaseLayout';
import { useAsapContext } from './services/state/AsapContextProvider';
import apiService from './services/api/api';
import './App.css';
import useAuth from './services/auth/hooks/useAuth';
import ComponentDevPage from './ComponentDevPage';

const App = () => {
    const { updateAsapUser, updateAsapCountApplication } = useAsapContext();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated()) {
            apiService.AuthService.getCurrentUser().then(user => updateAsapUser({ ...user }));
            apiService.AdminService.getCountOfAllApplication().then(respone =>
                updateAsapCountApplication({ ...respone })
            );
        }
    }, [isAuthenticated, updateAsapUser, updateAsapCountApplication]);
    return (
        <div className="App">
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/ComponentDevPage" element={<ComponentDevPage />} />
                <Route
                    path="*"
                    exact
                    element={
                        <PrivateRoute>
                            <BaseLayout />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </div>
    );
};

export default App;
