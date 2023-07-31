import React, { useEffect, useMemo, useState } from 'react';
import { Route } from 'react-router-dom';
import { getRoutesForRole } from '../routing-utils';
import PrivateRoute from '../PrivateRoute';
import useAuth from '../../auth/hooks/useAuth';
import apiService from '../../api/api';
import { useAsapContext } from '../../state/AsapContextProvider';

const routesPerRole = routesMetadataForRole =>
    routesMetadataForRole.map(({ id, path, Component }) => (
        <Route
            key={id}
            path={path}
            element={
                <PrivateRoute>
                     <Component />
                </PrivateRoute>
            }
        />
    ));

const useRouting = () => {
    const { primaryRole } = useAuth();
    const { asapUser } = useAsapContext();
    const [initialRoute, setInitialRoute] = useState(null);

    const routesMetadataForRole = useMemo(() => getRoutesForRole(primaryRole), [primaryRole]);

    const routes = useMemo(() => routesPerRole(routesMetadataForRole), [routesMetadataForRole]);

    useEffect(() => {
        if (primaryRole === 'asap-dept-member') {
            apiService.ApplicationService.getMemberApplication(asapUser.id).then(response => {
                const application = response[response.length - 1];
                if (application !== undefined) {
                    setInitialRoute(routesMetadataForRole[2]?.path.replace(':id', application?.id));
                } else {
                    setInitialRoute(routesMetadataForRole[0]?.path);
                }
            });
        } else {
            setInitialRoute(routesMetadataForRole[0]?.path);
        }
    }, [primaryRole, routesMetadataForRole, asapUser.id]);

    return { routes, routesMetadataForRole, initialRoute };
};

export default useRouting;
