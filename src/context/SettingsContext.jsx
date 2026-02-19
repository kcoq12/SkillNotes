import React, { useEffect, useState } from 'react';
import SettingsContext from './settingsContextStore';

const APP_SETTINGS_STORAGE_KEY = 'skillnotes.app-settings.v1';

const DEFAULT_SETTINGS = {
    themeMode: 'system',
    notificationsEnabled: true,
};

const isBrowser = () => typeof window !== 'undefined';

const readStoredSettings = () => {
    if (!isBrowser()) {
        return DEFAULT_SETTINGS;
    }

    try {
        const raw = window.localStorage.getItem(APP_SETTINGS_STORAGE_KEY);
        if (!raw) {
            return DEFAULT_SETTINGS;
        }

        const parsed = JSON.parse(raw);

        return {
            themeMode: ['light', 'dark', 'system'].includes(parsed?.themeMode)
                ? parsed.themeMode
                : DEFAULT_SETTINGS.themeMode,
            notificationsEnabled: typeof parsed?.notificationsEnabled === 'boolean'
                ? parsed.notificationsEnabled
                : DEFAULT_SETTINGS.notificationsEnabled,
        };
    } catch {
        return DEFAULT_SETTINGS;
    }
};

const getSystemTheme = () => {
    if (!isBrowser()) {
        return 'dark';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(readStoredSettings);
    const [systemTheme, setSystemTheme] = useState(getSystemTheme);

    const resolvedTheme = settings.themeMode === 'system' ? systemTheme : settings.themeMode;

    useEffect(() => {
        if (!isBrowser()) {
            return;
        }

        try {
            window.localStorage.setItem(APP_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
        } catch {
            // Ignore storage write failures.
        }
    }, [settings]);

    useEffect(() => {
        if (!isBrowser()) {
            return undefined;
        }

        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const updateTheme = () => setSystemTheme(media.matches ? 'dark' : 'light');

        updateTheme();
        media.addEventListener('change', updateTheme);

        return () => media.removeEventListener('change', updateTheme);
    }, []);

    useEffect(() => {
        if (!isBrowser()) {
            return;
        }

        document.documentElement.setAttribute('data-theme', resolvedTheme);
    }, [resolvedTheme]);

    const setThemeMode = (themeMode) => {
        if (!['light', 'dark', 'system'].includes(themeMode)) {
            return;
        }

        setSettings((prev) => ({ ...prev, themeMode }));
    };

    const setNotificationsEnabled = (enabled) => {
        setSettings((prev) => ({ ...prev, notificationsEnabled: Boolean(enabled) }));
    };

    const importSettings = (incomingSettings) => {
        if (!incomingSettings || typeof incomingSettings !== 'object') {
            return;
        }

        setSettings((prev) => ({
            ...prev,
            themeMode: ['light', 'dark', 'system'].includes(incomingSettings.themeMode)
                ? incomingSettings.themeMode
                : prev.themeMode,
            notificationsEnabled: typeof incomingSettings.notificationsEnabled === 'boolean'
                ? incomingSettings.notificationsEnabled
                : prev.notificationsEnabled,
        }));
    };

    return (
        <SettingsContext.Provider
            value={{
                settings,
                resolvedTheme,
                setThemeMode,
                setNotificationsEnabled,
                importSettings,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};
