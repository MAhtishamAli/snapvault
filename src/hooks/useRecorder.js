import { useState, useRef, useCallback, useEffect } from 'react';

export function useRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isBlurActive, setIsBlurActive] = useState(true);
    const [elapsed, setElapsed] = useState(0);
    const [showFlash, setShowFlash] = useState(false);
    const [snapCount, setSnapCount] = useState(0);
    const [recordedBlob, setRecordedBlob] = useState(null);

    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const chunksRef = useRef([]);
    const intervalRef = useRef(null);

    // Timer effect
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

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        setIsPaused(false);
    }, []);

    const startRecording = useCallback(async () => {
        try {
            // 1. Get screen video
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: { frameRate: { ideal: 30 } },
                audio: true, // System audio if user allows
            });

            // 2. Get mic audio
            let micStream = null;
            try {
                micStream = await navigator.mediaDevices.getUserMedia({
                    audio: { echoCancellation: true, noiseSuppression: true },
                });
            } catch (err) {
                console.warn('Microphone access denied or unavailable', err);
            }

            // 3. Combine tracks
            const tracks = [...screenStream.getTracks()];
            if (micStream) {
                tracks.push(...micStream.getAudioTracks());
            }
            const combinedStream = new MediaStream(tracks);
            streamRef.current = combinedStream;

            // Handle native browser "Stop sharing" button
            screenStream.getVideoTracks()[0].onended = () => {
                stopRecording();
            };

            // 4. Create MediaRecorder
            const options = { mimeType: 'video/webm;codecs=vp8,opus' };
            const recorder = new MediaRecorder(combinedStream, options);
            mediaRecorderRef.current = recorder;
            chunksRef.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                setRecordedBlob(blob);
                chunksRef.current = [];
                // Cleanup tracks
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(t => t.stop());
                }
            };

            recorder.start(1000); // 1-second chunks
            setIsRecording(true);
            setIsPaused(false);
            setElapsed(0);
            setRecordedBlob(null);

        } catch (err) {
            console.error('Failed to start recording:', err);
            throw err;
        }
    }, [stopRecording]);

    const toggleRecording = useCallback(() => {
        if (isRecording) stopRecording();
        else startRecording();
    }, [isRecording, startRecording, stopRecording]);

    const togglePause = useCallback(() => {
        if (isRecording && mediaRecorderRef.current) {
            if (isPaused) {
                mediaRecorderRef.current.resume();
                setIsPaused(false);
            } else {
                mediaRecorderRef.current.pause();
                setIsPaused(true);
            }
        }
    }, [isRecording, isPaused]);

    const toggleMute = useCallback(() => {
        if (streamRef.current) {
            const audioTracks = streamRef.current.getAudioTracks();
            audioTracks.forEach(t => t.enabled = isMuted); // toggle opposite
        }
        setIsMuted((prev) => !prev);
    }, [isMuted]);

    const toggleBlur = useCallback(() => {
        setIsBlurActive((prev) => !prev);
    }, []);

    // Take screenshot using a dummy video element and canvas
    const takeSnap = useCallback(async () => {
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 400);

        if (!streamRef.current) {
            setSnapCount((prev) => prev + 1);
            return null;
        }

        try {
            const videoTrack = streamRef.current.getVideoTracks()[0];
            if (!videoTrack) return null;

            const video = document.createElement('video');
            video.srcObject = new MediaStream([videoTrack]);
            video.muted = true;
            await video.play();

            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            video.pause();
            video.srcObject = null;

            return new Promise((resolve) => {
                canvas.toBlob((blob) => {
                    setSnapCount((prev) => prev + 1);
                    resolve(blob);
                }, 'image/png');
            });
        } catch (err) {
            console.error('Snapshot failed:', err);
            setSnapCount((prev) => prev + 1);
            return null;
        }
    }, []);

    const formatTime = useCallback((seconds) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }, []);

    const clearRecordedBlob = useCallback(() => setRecordedBlob(null), []);

    return {
        isRecording,
        isPaused,
        isMuted,
        isBlurActive,
        elapsed,
        showFlash,
        snapCount,
        formattedTime: formatTime(elapsed),
        recordedBlob,
        clearRecordedBlob,
        startRecording,
        stopRecording,
        toggleRecording,
        togglePause,
        toggleMute,
        toggleBlur,
        takeSnap,
    };
}
