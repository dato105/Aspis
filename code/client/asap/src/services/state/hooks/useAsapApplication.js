import { useCallback, useState } from 'react';

const asapCountApplicationInitial = {};

export const useAsapCountAllApplication = () => {
    const [asapCountApplication, setAsapCountApplication] = useState(asapCountApplicationInitial);

    const updateAsapCountApplication = useCallback(updateAsapCountApplication => {
        setAsapCountApplication(currentAsapCountApplication => ({...currentAsapCountApplication, ...updateAsapCountApplication}));
    }, []);

    return {asapCountApplication, updateAsapCountApplication};
};