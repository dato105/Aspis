import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { loadLocaleData } from './services/i18n/I18NProvider';
import AsapProviders from './services/AsapProviders';
import './index.css';

(async () => {
    const messages = await loadLocaleData();

    ReactDOM.render(
        <React.StrictMode>
            <AsapProviders messages={messages}>
                <App />
            </AsapProviders>
        </React.StrictMode>,
        document.getElementById('root')
    );
})();
