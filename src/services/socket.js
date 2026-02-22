import io from 'socket.io-client';
import { useCallback, useEffect, useState } from 'react';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Shared socket instance
export const socket = io(SOCKET_URL, {
    autoConnect: true,
});

/**
 * Custom hook to listen to Server-Sent processing status.
 */
export function useProcessingStatus() {
    const [status, setStatus] = useState(null);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const onStatus = (data) => {
            setStatus(data.status);
            setProgress(data.progress);
            setIsProcessing(data.progress < 100);
            if (data.progress === 100) {
                // Reset after brief delay
                setTimeout(() => {
                    setIsProcessing(false);
                    setStatus(null);
                    setProgress(0);
                }, 3000);
            }
        };

        const onError = (data) => {
            setError(data.error);
            setIsProcessing(false);
            setStatus('Error occurred');
        };

        socket.on('processing:status', onStatus);
        socket.on('processing:error', onError);

        return () => {
            socket.off('processing:status', onStatus);
            socket.off('processing:error', onError);
        };
    }, []);

    const reset = useCallback(() => {
        setStatus(null);
        setProgress(0);
        setError(null);
        setIsProcessing(false);
    }, []);

    return {
        status,
        progress,
        error,
        isProcessing,
        socketId: socket.id,
        reset
    };
}
