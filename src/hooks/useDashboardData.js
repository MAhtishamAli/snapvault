import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { securityTimeSeries, timeSavedData } from '../data/mockData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function useDashboardData() {
    const { token, user } = useAuth();
    const [stats, setStats] = useState(null);
    const [recordings, setRecordings] = useState([]);

    const loadData = async () => {
        if (!token) return;
        try {
            const [dashRes, recRes] = await Promise.all([
                axios.get(`${API_URL}/dashboard`),
                axios.get(`${API_URL}/recordings`),
            ]);
            setStats(dashRes.data.stats);
            setRecordings(recRes.data.recordings);
        } catch (err) {
            console.error('Failed to load dashboard data', err);
        }
    };

    useEffect(() => {
        if (user) {
            loadData();
        } else {
            setStats(null);
            setRecordings([]);
        }
    }, [user, token]);

    const totals = useMemo(() => {
        if (!stats) return { totalDetected: 0, totalBlurred: 0, blurRate: 0, minutesSaved: 0, hoursSaved: 0, totalRecordings: 0 };
        return {
            totalDetected: stats.detections,
            totalBlurred: stats.blurred,
            blurRate: stats.detections > 0 ? Math.round((stats.blurred / stats.detections) * 100) : 0,
            minutesSaved: stats.detections * 5, // mock 5 min per detection
            hoursSaved: Math.round((stats.detections * 5) / 60 * 10) / 10,
            totalRecordings: stats.recordings || recordings.length,
            snaps: stats.snaps
        };
    }, [stats, recordings]);

    return {
        securityData: securityTimeSeries, // mock chart 
        privacyMix: stats?.privacyMix || [], // real
        timeSaved: timeSavedData, // mock chart
        recordings, // real
        totals,
        refresh: loadData
    };
}
