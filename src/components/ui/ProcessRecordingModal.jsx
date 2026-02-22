import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, CheckCircle2, ShieldCheck, Video, X } from 'lucide-react';
import ManualBlurCanvas from '../recorder/ManualBlurCanvas';
import { uploadRecording, processRecording } from '../../services/api';
import { useProcessingStatus } from '../../services/socket';

export default function ProcessRecordingModal({ blob, onClose, onComplete }) {
    const videoRef = useRef(null);
    const [blurZones, setBlurZones] = useState([]);
    const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });
    const [videoSrc, setVideoSrc] = useState(null);

    // Upload & Process States
    const [isUploading, setIsUploading] = useState(false);
    const [uploadPercent, setUploadPercent] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [done, setDone] = useState(false);
    const [processedResult, setProcessedResult] = useState(null);

    const { status: socketStatus, progress: socketProgress, socketId } = useProcessingStatus();

    // Init video source
    useEffect(() => {
        if (blob) {
            const url = URL.createObjectURL(blob);
            setVideoSrc(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [blob]);

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            // We want to overlay the canvas exactly on the visible video.
            // But since video is object-fit: contain, we need to match the actual rendered size.
            // For simplicity in this demo, we'll force the container to be the exact aspect ratio
            // or we track clientWidth/clientHeight.
            setVideoDimensions({
                width: videoRef.current.clientWidth,
                height: videoRef.current.clientHeight
            });
        }
    };

    const handleStartProcessing = async () => {
        try {
            // 1. Upload
            setIsUploading(true);
            const filename = `recording_${Date.now()}.webm`;
            await uploadRecording(blob, filename, (pct) => setUploadPercent(pct));
            setIsUploading(false);

            // 2. Process
            setIsProcessing(true);

            // Note: Manual blur coordinates on the client element need to be scaled to the real video resolution.
            // We'll calculate the scale factor before sending to the backend.
            const scaleX = videoRef.current.videoWidth / videoDimensions.width;
            const scaleY = videoRef.current.videoHeight / videoDimensions.height;

            const scaledZones = blurZones.map(z => ({
                x: Math.round(z.x * scaleX),
                y: Math.round(z.y * scaleY),
                w: Math.round(z.w * scaleX),
                h: Math.round(z.h * scaleY),
            }));

            const result = await processRecording(filename, scaledZones, socketId);

            setProcessedResult(result);
            setIsProcessing(false);
            setDone(true);

        } catch (err) {
            console.error('Processing failed:', err);
            setIsUploading(false);
            setIsProcessing(false);
        }
    };

    const handleFinish = () => {
        if (onComplete && processedResult) {
            onComplete(processedResult);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-base/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl bg-surface rounded-2xl border border-border overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface-raised">
                    <div>
                        <h2 className="text-lg font-bold text-text-primary">Review & Process Recording</h2>
                        <p className="text-sm text-text-muted mt-1">Draw rectangles over any sensitive areas to manually blur them.</p>
                    </div>
                    {!isUploading && !isProcessing && !done && (
                        <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-hover-overlay transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">

                    {!isUploading && !isProcessing && !done && (
                        <div className="relative rounded-xl overflow-hidden bg-black/50 shadow-inner max-w-full">
                            {videoSrc && (
                                <video
                                    ref={videoRef}
                                    src={videoSrc}
                                    controls={false}
                                    autoPlay
                                    loop
                                    muted
                                    onLoadedMetadata={handleLoadedMetadata}
                                    className="max-h-[50vh] object-contain block mx-auto"
                                    style={{ maxWidth: '100%' }}
                                />
                            )}
                            {videoDimensions.width > 0 && (
                                <div
                                    className="absolute inset-0 mx-auto"
                                    style={{ width: videoDimensions.width, height: videoDimensions.height }}
                                >
                                    <ManualBlurCanvas
                                        width={videoDimensions.width}
                                        height={videoDimensions.height}
                                        onZonesChange={setBlurZones}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Status UI */}
                    {(isUploading || isProcessing || done) && (
                        <div className="w-full max-w-md mx-auto py-12 flex flex-col items-center text-center">

                            {isUploading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                                        <UploadCloud className="w-8 h-8 text-primary animate-bounce" />
                                    </div>
                                    <h3 className="text-xl font-bold text-text-primary mb-2">Uploading Securely...</h3>
                                    <div className="w-full bg-surface-raised h-2 rounded-full overflow-hidden mt-4">
                                        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${uploadPercent}%` }} />
                                    </div>
                                    <p className="text-sm text-text-muted mt-3">{uploadPercent}% complete</p>
                                </motion.div>
                            )}

                            {isProcessing && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center w-full">
                                    <div className="w-16 h-16 rounded-full bg-teal/20 flex items-center justify-center mb-6">
                                        <ShieldCheck className="w-8 h-8 text-teal pulse-ring" />
                                    </div>
                                    <h3 className="text-xl font-bold text-text-primary mb-2">AI Processing Pipeline</h3>
                                    <p className="text-sm text-text-muted mb-6">{socketStatus || 'Initializing...'}</p>

                                    <div className="w-full bg-surface-raised h-2 rounded-full overflow-hidden">
                                        <div className="h-full bg-teal transition-all duration-300" style={{ width: `${socketProgress || 0}%` }} />
                                    </div>
                                </motion.div>
                            )}

                            {done && (
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-emerald/20 flex items-center justify-center mb-4">
                                        <CheckCircle2 className="w-8 h-8 text-emerald" />
                                    </div>
                                    <h3 className="text-xl font-bold text-text-primary mb-2">Processing Complete</h3>
                                    <p className="text-sm text-text-muted mb-6">
                                        AI Privacy Shield successfully secured your recording.
                                        {processedResult?.detections > 0 && ` Blurred ${processedResult.detections} areas.`}
                                    </p>
                                    <button
                                        onClick={handleFinish}
                                        className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all"
                                    >
                                        View Secure Recording
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                {!isUploading && !isProcessing && !done && (
                    <div className="px-6 py-4 bg-surface-raised border-t border-border flex justify-between items-center">
                        <div className="text-sm text-text-muted flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-teal inline-block"></span>
                            AI Auto-Blur Enabled
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-text-secondary hover:text-text-primary hover:bg-hover-overlay transition-colors"
                            >
                                Discard
                            </button>
                            <button
                                onClick={handleStartProcessing}
                                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center gap-2 hover:-translate-y-0.5"
                            >
                                <Video className="w-4 h-4" />
                                Process & Save
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
