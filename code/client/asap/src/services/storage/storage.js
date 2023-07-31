export const STORAGE_ASAP_AUTH_STATE = 'asapAuthState';
export const STORAGE_ASAP_APPOINTMENTS_STATE = 'asapAppointmentsState';

const getFromLocalStorage = (key, defaultValue = undefined) => getItemFromStorage(localStorage, key, defaultValue);

const saveToLocalStorage = (key, item) => saveItemToStorage(localStorage, key, item);

const getFromSessionStorage = (key, defaultValue = undefined) => getItemFromStorage(sessionStorage, key, defaultValue);

const saveToSessionStorage = (key, item) => saveItemToStorage(sessionStorage, key, item);

const removeFromLocalStorage = key => removeFromStorage(localStorage, key);

const removeFromSessionStorage = key => removeFromStorage(sessionStorage, key);

const clearLocalStorage = () => clearStorage(localStorage);

const clearSessionStorage = () => clearStorage(sessionStorage);

const removeFromStorage = (storage, key) => {
    storage.removeItem(key);
};

const getItemFromStorage = (storage, key, defaultValue = undefined) => {
    try {
        const item = storage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        return defaultValue;
    }
};

const saveItemToStorage = (storage, key, item) => {
    try {
        storage.setItem(key, JSON.stringify(item));
    } catch (error) {}
};

const clearStorage = storage => {
    try {
        storage.clear();
    } catch (error) {}
};

export {
    getFromLocalStorage,
    saveToLocalStorage,
    removeFromLocalStorage,
    clearLocalStorage,
    getFromSessionStorage,
    saveToSessionStorage,
    removeFromSessionStorage,
    clearSessionStorage,
};
