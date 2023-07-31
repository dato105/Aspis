import React from 'react';
import { IntlProvider } from 'react-intl';
import flatten from 'flat';

const DEFAULT_LOCALE = 'he';

export const loadLocaleData = async (locale = DEFAULT_LOCALE) => {
    try {
        return await import(`./locales/${locale}.json`);
    } catch (e) {
        return await import(`./locales/${DEFAULT_LOCALE}.json`);
    }
};

const I18NProvider = ({ messages, locale = DEFAULT_LOCALE, children }) => {
    return (
        <IntlProvider locale={locale} defaultLocale={DEFAULT_LOCALE} messages={flatten(messages)}>
            {children}
        </IntlProvider>
    );
};

export default I18NProvider;
