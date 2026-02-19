import { useMemo } from 'react';
import { securityTimeSeries, privacyCategories, timeSavedData, recordingHistory } from '../data/mockData';

/**
 * Custom hook that processes dashboard data.
 * Swap mock imports for API calls when connecting a backend.
 *
 * @returns {{ securityData, privacyMix, timeSaved, recordings, totals }}
 */
export function useDashboardData() {
    const totals = useMemo(() => {
        const totalDetected = securityTimeSeries.reduce((sum, d) => sum + d.detected, 0);
        const totalBlurred = securityTimeSeries.reduce((sum, d) => sum + d.blurred, 0);
        const blurRate = totalDetected > 0 ? Math.round((totalBlurred / totalDetected) * 100) : 0;

        const totalManualMinutes = timeSavedData.reduce((sum, d) => sum + d.manual, 0);
        const totalAutoMinutes = timeSavedData.reduce((sum, d) => sum + d.automated, 0);
        const minutesSaved = totalManualMinutes - totalAutoMinutes;
        const hoursSaved = Math.round(minutesSaved / 60 * 10) / 10;

        return {
            totalDetected,
            totalBlurred,
            blurRate,
            minutesSaved,
            hoursSaved,
            totalRecordings: recordingHistory.length,
        };
    }, []);

    return {
        securityData: securityTimeSeries,
        privacyMix: privacyCategories,
        timeSaved: timeSavedData,
        recordings: recordingHistory,
        totals,
    };
}
