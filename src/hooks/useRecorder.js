import { useState, useRef, useCallback, useEffect } from 'react';

export function useRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isBlurActive, setIsBlurActive] = useState(true);
    const [elapsed, setElapsed] = useState(0);
    const [showFlash, setShowFlash] = useState(false);
    const [snapCount, setSnapCount] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isRecording && !isPaused) {
            intervalRef.current = setInterval(() => {
                setElapsed((prev) => prev + 1);
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isRecording, isPaused]);

    const startRecording = useCallback(() => {
        setIsRecording(true);
        setIsPaused(false);
        setElapsed(0);
    }, []);

    const stopRecording = useCallback(() => {
        setIsRecording(false);
        setIsPaused(false);
        setElapsed(0);
    }, []);

    const toggleRecording = useCallback(() => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    }, [isRecording, startRecording, stopRecording]);

    const togglePause = useCallback(() => {
        if (isRecording) {
            setIsPaused((prev) => !prev);
        }
    }, [isRecording]);

    const toggleMute = useCallback(() => {
        setIsMuted((prev) => !prev);
    }, []);

    const toggleBlur = useCallback(() => {
        setIsBlurActive((prev) => !prev);
    }, []);

    const takeSnap = useCallback(() => {
        setShowFlash(true);
        setSnapCount((prev) => prev + 1);
        setTimeout(() => setShowFlash(false), 400);
    }, []);

    const formatTime = useCallback((seconds) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }, []);

    return {
        isRecording,
        isPaused,
        isMuted,
        isBlurActive,
        elapsed,
        showFlash,
        snapCount,
        formattedTime: formatTime(elapsed),
        startRecording,
        stopRecording,
        toggleRecording,
        togglePause,
        toggleMute,
        toggleBlur,
        takeSnap,
    };
}
