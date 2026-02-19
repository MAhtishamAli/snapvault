import { useState, useRef, useEffect } from 'react';
import {
    Circle,
    Square,
    Pause,
    Play,
    MicOff,
    Mic,
    Camera,
    Eye,
    EyeOff,
    GripHorizontal,
} from 'lucide-react';

export default function ControlBar({
    isRecording,
    isPaused,
    isMuted,
    isBlurActive,
    formattedTime,
    onToggleRecording,
    onTogglePause,
    onToggleMute,
    onToggleBlur,
    onSnap,
}) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef(null);
    const offsetRef = useRef({ x: 0, y: 0 });

    // Center the bar initially
    useEffect(() => {
        setPosition({
            x: Math.max(0, (window.innerWidth - 480) / 2),
            y: window.innerHeight - 100,
        });
    }, []);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        offsetRef.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            setPosition({
                x: e.clientX - offsetRef.current.x,
                y: e.clientY - offsetRef.current.y,
            });
        };

        const handleMouseUp = () => setIsDragging(false);

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div
            ref={dragRef}
            className="fixed z-50 fade-in"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
        >
            <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl shadow-black/40">
                {/* Drag handle */}
                <button
                    onMouseDown={handleMouseDown}
                    className="p-1 text-text-muted hover:text-text-primary cursor-grab active:cursor-grabbing transition-colors"
                    title="Drag to move"
                >
                    <GripHorizontal className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-border-subtle" />

                {/* Record/Stop */}
                <button
                    onClick={onToggleRecording}
                    className={`p-2.5 rounded-xl transition-all duration-200 cursor-pointer ${isRecording
                            ? 'bg-crimson/20 text-crimson hover:bg-crimson/30'
                            : 'bg-crimson text-white hover:bg-crimson-dark shadow-lg shadow-crimson/30'
                        }`}
                    title={isRecording ? 'Stop Recording' : 'Start Recording'}
                >
                    {isRecording ? (
                        <Square className="w-5 h-5" fill="currentColor" />
                    ) : (
                        <Circle className="w-5 h-5" fill="currentColor" />
                    )}
                </button>

                {/* Pause */}
                <button
                    onClick={onTogglePause}
                    disabled={!isRecording}
                    className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${!isRecording
                            ? 'text-text-muted/30 cursor-not-allowed'
                            : isPaused
                                ? 'text-cyan-accent bg-cyan-accent/10'
                                : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                        }`}
                    title={isPaused ? 'Resume' : 'Pause'}
                >
                    {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                </button>

                {/* Timer */}
                {isRecording && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-crimson/10 min-w-[70px]">
                        <span className={`w-2 h-2 rounded-full bg-crimson ${isPaused ? '' : 'rec-dot'}`} />
                        <span className="text-sm font-mono font-semibold text-crimson">{formattedTime}</span>
                    </div>
                )}

                <div className="w-px h-6 bg-border-subtle" />

                {/* Mute */}
                <button
                    onClick={onToggleMute}
                    className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${isMuted
                            ? 'text-crimson bg-crimson/10'
                            : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                        }`}
                    title={isMuted ? 'Unmute' : 'Mute'}
                >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Snap */}
                <button
                    onClick={onSnap}
                    className="p-2 rounded-lg text-text-secondary hover:text-cyan-accent hover:bg-cyan-accent/10 transition-all duration-200 cursor-pointer"
                    title="Take Screenshot"
                >
                    <Camera className="w-5 h-5" />
                </button>

                <div className="w-px h-6 bg-border-subtle" />

                {/* Blur Toggle */}
                <button
                    onClick={onToggleBlur}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${isBlurActive
                            ? 'bg-cyan-accent/15 text-cyan-accent border border-cyan-accent/30'
                            : 'bg-white/5 text-text-muted border border-transparent hover:border-border-subtle'
                        }`}
                    title={isBlurActive ? 'Disable Blur' : 'Enable Blur'}
                >
                    {isBlurActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    Blur
                </button>
            </div>
        </div>
    );
}
