import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'snapvault-theme';

function getSystemTheme() {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme() {
    try {
        return localStorage.getItem(STORAGE_KEY); // 'light' | 'dark' | 'system' | null
    } catch {
        return null;
    }
}

function resolveTheme(preference) {
    if (preference === 'system' || !preference) return getSystemTheme();
    return preference;
}

export function useTheme() {
    const [preference, setPreference] = useState(() => getStoredTheme() || 'system');
    const resolved = resolveTheme(preference);

    // Apply class to <html>
    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(resolved);
    }, [resolved]);

    // Persist to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, preference);
        } catch { /* noop */ }
    }, [preference]);

    // Listen for system theme changes
    useEffect(() => {
        if (preference !== 'system') return;
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => setPreference('system'); // force re-render
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, [preference]);

    const setTheme = useCallback((t) => setPreference(t), []);
    const toggleTheme = useCallback(() => {
        setPreference(prev => {
            const current = resolveTheme(prev);
            return current === 'dark' ? 'light' : 'dark';
        });
    }, []);

    return {
        theme: resolved,         // 'light' | 'dark'
        preference,              // 'light' | 'dark' | 'system'
        systemTheme: getSystemTheme(),
        setTheme,
        toggleTheme,
    };
}
