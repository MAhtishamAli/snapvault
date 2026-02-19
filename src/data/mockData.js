/**
 * SnapVault — Mock Data
 * Swap this file for real API calls when connecting a backend.
 */

// Generate 30 days of security time-series data
function generateSecurityTimeSeries() {
    const data = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const detected = Math.floor(Math.random() * 18) + 2;
        const blurred = Math.floor(detected * (0.82 + Math.random() * 0.18));
        data.push({
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            detected,
            blurred,
        });
    }
    return data;
}

/** @type {{ date: string, detected: number, blurred: number }[]} */
export const securityTimeSeries = generateSecurityTimeSeries();

/** @type {{ name: string, value: number, color: string }[]} */
export const privacyCategories = [
    { name: 'API Keys', value: 42, color: '#6366f1' },
    { name: 'Passwords', value: 28, color: '#ef4444' },
    { name: 'Emails', value: 18, color: '#f59e0b' },
    { name: 'PII Data', value: 8, color: '#10b981' },
    { name: 'Card Numbers', value: 4, color: '#8b5cf6' },
];

/** @type {{ month: string, manual: number, automated: number }[]} */
export const timeSavedData = [
    { month: 'Sep', manual: 48, automated: 6 },
    { month: 'Oct', manual: 62, automated: 8 },
    { month: 'Nov', manual: 55, automated: 5 },
    { month: 'Dec', manual: 71, automated: 9 },
    { month: 'Jan', manual: 84, automated: 7 },
    { month: 'Feb', manual: 93, automated: 11 },
];

/** @type {{ id: number, title: string, duration: string, secretsFound: number, date: string, gradient: string }[]} */
export const recordingHistory = [
    { id: 1, title: 'Sprint Planning Call', duration: '24:31', secretsFound: 3, date: '2 hours ago', gradient: 'from-indigo/20 to-purple-600/20' },
    { id: 2, title: 'API Key Review Session', duration: '08:15', secretsFound: 7, date: '5 hours ago', gradient: 'from-crimson/20 to-orange-500/20' },
    { id: 3, title: 'Bug Fix Walkthrough', duration: '12:42', secretsFound: 0, date: 'Yesterday', gradient: 'from-emerald/20 to-teal-600/20' },
    { id: 4, title: 'Database Migration Demo', duration: '35:08', secretsFound: 2, date: 'Yesterday', gradient: 'from-blue-500/20 to-indigo/20' },
    { id: 5, title: 'Deployment Pipeline', duration: '18:55', secretsFound: 5, date: '2 days ago', gradient: 'from-amber/20 to-yellow-600/20' },
    { id: 6, title: 'Client Onboarding', duration: '41:20', secretsFound: 1, date: '3 days ago', gradient: 'from-pink-500/20 to-rose-500/20' },
];
