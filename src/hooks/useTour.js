import { useState, useCallback, useEffect } from 'react';

const TOUR_STORAGE_KEY = 'snapvault-tour-completed';

const TOUR_STEPS = [
    {
        id: 'welcome',
        target: null,
        title: 'Welcome to SnapVault! 🎉',
        description: 'Your all-in-one privacy-first screen recorder. Let us show you around — it takes 30 seconds.',
        placement: 'center',
    },
    {
        id: 'record',
        target: '[data-tour="record"]',
        title: 'One-Click Recording',
        description: 'Hit this button to start a secure screen recording. All sensitive data is protected automatically.',
        placement: 'bottom',
    },
    {
        id: 'snap',
        target: '[data-tour="snap"]',
        title: 'Instant Screenshots',
        description: 'Capture a screenshot with one click. A flash confirms the snap was taken.',
        placement: 'bottom',
    },
    {
        id: 'ai-shield',
        target: '[data-tour="ai-shield"]',
        title: 'AI Privacy Shield',
        description: 'Toggle AI-powered redaction. When active, API keys, passwords, and PII are automatically blurred in real-time.',
        placement: 'bottom',
    },
    {
        id: 'sidebar',
        target: '[data-tour="sidebar"]',
        title: 'Navigate Your Workspace',
        description: 'Access your Library, AI-Redaction rules, and Settings from the sidebar. Hover icons for labels.',
        placement: 'right',
    },
    {
        id: 'charts',
        target: '[data-tour="charts"]',
        title: 'Security Analytics',
        description: 'Monitor your security posture — see threats detected, categories breakdown, and time saved by AI.',
        placement: 'top',
    },
    {
        id: 'done',
        target: null,
        title: 'You\'re All Set! 🚀',
        description: 'Start recording and let SnapVault protect your sensitive data. You can replay this tour anytime from the dashboard.',
        placement: 'center',
    },
];

/**
 * Hook to manage the interactive onboarding tour.
 * @returns {{ isActive, currentStep, stepIndex, totalSteps, next, prev, skip, start, isCompleted }}
 */
export function useTour() {
    const [isActive, setIsActive] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);
    const [isCompleted, setIsCompleted] = useState(() => {
        try { return localStorage.getItem(TOUR_STORAGE_KEY) === 'true'; } catch { return false; }
    });

    const currentStep = TOUR_STEPS[stepIndex] || TOUR_STEPS[0];
    const totalSteps = TOUR_STEPS.length;

    const next = useCallback(() => {
        if (stepIndex < totalSteps - 1) {
            setStepIndex(i => i + 1);
        } else {
            setIsActive(false);
            setIsCompleted(true);
            try { localStorage.setItem(TOUR_STORAGE_KEY, 'true'); } catch { }
        }
    }, [stepIndex, totalSteps]);

    const prev = useCallback(() => {
        if (stepIndex > 0) setStepIndex(i => i - 1);
    }, [stepIndex]);

    const skip = useCallback(() => {
        setIsActive(false);
        setIsCompleted(true);
        try { localStorage.setItem(TOUR_STORAGE_KEY, 'true'); } catch { }
    }, []);

    const start = useCallback(() => {
        setStepIndex(0);
        setIsActive(true);
    }, []);

    // Auto-start on first visit
    useEffect(() => {
        if (!isCompleted) {
            const timer = setTimeout(() => setIsActive(true), 800);
            return () => clearTimeout(timer);
        }
    }, [isCompleted]);

    return { isActive, currentStep, stepIndex, totalSteps, next, prev, skip, start, isCompleted };
}

export { TOUR_STEPS };
