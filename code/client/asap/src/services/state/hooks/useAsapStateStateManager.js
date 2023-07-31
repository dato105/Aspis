import { useCallback, useState } from 'react';

const asapStateInitialState = {};

export const useAsapStateStateManager = () => {
    const [asapState, setAsapState] = useState(asapStateInitialState);

    const updateAsapState = useCallback(updatedAsapState => {
        setAsapState(currentAsapState => ({ ...currentAsapState, ...updatedAsapState }));
    }, []);

    return { asapState, updateAsapState };
};
