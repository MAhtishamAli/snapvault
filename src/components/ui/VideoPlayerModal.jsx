import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, ShieldAlert, Download, Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Button from './Button';
import { modalOverlay, modalContent } from '../../animations/variants';

export default function VideoPlayerModal({ video, onClose }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval;
        if (isPlaying && progress < 100) {
            interval = setInterval(() => setProgress(prev => Math.min(prev + 0.5, 100)), 100);
        }
        if (progress >= 100) setIsPlaying(false);
        return () => clearInterval(interval);
    }, [isPlaying, progress]);

    if (!video) return null;

    return (
        <AnimatePresence>
            <motion.div
                {...modalOverlay}
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    {...modalContent}
                    className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl mx-8"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Video */}
                    <div
                        className={`relative bg-gradient-to-br ${video.gradient} aspect-video flex items-center justify-center cursor-pointer group`}
                        onClick={() => setIsPlaying(!isPlaying)}
                    >
                        {!isPlaying && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-20 h-20 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center hover:bg-white/25 transition-colors"
                            >
                                <Play className="w-8 h-8 text-white ml-1" fill="white" />
                            </motion.div>
                        )}

                        {video.secrets > 0 && (
                            <div className="absolute top-5 left-5 px-4 py-2 rounded-xl bg-crimson/85 text-sm font-semibold text-white flex items-center gap-2.5">
                                <ShieldAlert className="w-4 h-4" />{video.secrets} Secrets Redacted
                            </div>
                        )}

                        {/* Progress */}
                        <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="h-1 bg-white/20 cursor-pointer" onClick={(e) => { e.stopPropagation(); setProgress((e.nativeEvent.offsetX / e.currentTarget.offsetWidth) * 100); }}>
                                <motion.div className="h-full bg-indigo" style={{ width: `${progress}%` }} />
                            </div>
                            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-t from-black/70 to-transparent">
                                <div className="flex items-center gap-4">
                                    <button onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }} className="text-white hover:text-indigo transition-colors cursor-pointer">
                                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); setProgress(Math.max(0, progress - 10)); }} className="text-white/60 hover:text-white transition-colors cursor-pointer"><SkipBack className="w-4 h-4" /></button>
                                    <button onClick={(e) => { e.stopPropagation(); setProgress(Math.min(100, progress + 10)); }} className="text-white/60 hover:text-white transition-colors cursor-pointer"><SkipForward className="w-4 h-4" /></button>
                                    <span className="text-xs text-white/60 font-mono">{video.duration}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} className="text-white/60 hover:text-white transition-colors cursor-pointer">
                                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                    </button>
                                    <button onClick={(e) => e.stopPropagation()} className="text-white/60 hover:text-white transition-colors cursor-pointer"><Maximize className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>

                        <button onClick={onClose} className="absolute top-5 right-5 p-2.5 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors cursor-pointer">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Info */}
                    <div className="bg-surface p-6 border-t border-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-text-primary">{video.title}</h2>
                                <p className="text-sm text-text-muted mt-1">{video.date || video.time} · {video.duration} · {video.size || '145 MB'}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5" /> Download</Button>
                                <Button variant="primary" size="sm"><Share2 className="w-3.5 h-3.5" /> Share</Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
