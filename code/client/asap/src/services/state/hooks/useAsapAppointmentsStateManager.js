import { useCallback } from 'react';
import { getFromLocalStorage, STORAGE_ASAP_APPOINTMENTS_STATE } from '../../storage/storage';
import useLocalStorageState from 'use-local-storage-state';

const asapAppointmentsInitialState = getFromLocalStorage(STORAGE_ASAP_APPOINTMENTS_STATE) || {};

export const useAsapAppointmentsStateManager = () => {
    const [asapAppointments, setAsapAppointments] = useLocalStorageState(
        STORAGE_ASAP_APPOINTMENTS_STATE,
        asapAppointmentsInitialState
    );

    const updateAsapAppointments = useCallback(
        updatedAsapAppointments => {
            setAsapAppointments(currentAsapAppointments => ({
                ...currentAsapAppointments,
                ...updatedAsapAppointments,
            }));
        },
        [setAsapAppointments]
    );

    return { asapAppointments, updateAsapAppointments };
};
