import { motion } from 'framer-motion';
import { Camera, Square, Circle, Shield, Mic, MicOff, Search, Bell } from 'lucide-react';
import { springTap } from '../../animations/variants';

export default function Navbar({
    onNewRecording, onSnap, onToggleNotifications,
    isRecording, isMuted, onToggleMute,
    isBlurActive, onToggleBlur, formattedTime
}) {
    return (
        <header className="flex flex-col relative z-20">
            {/* Floating Zen Control Bar */}
            <div className="flex items-center justify-center py-3 px-4">
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 px-2 py-1.5 rounded-2xl glass"
                >
                    {/* Left: Snap + Record */}
                    <div className="flex items-center gap-1">
                        <motion.button
                            onClick={onSnap}
                            whileTap={springTap.whileTap}
                            data-tour="snap"
                            className="p-2.5 rounded-xl text-text-muted hover:text-text-primary hover:bg-[var(--sv-hover-overlay)] transition-all cursor-pointer"
                            title="Snap Photo"
                            aria-label="Take screenshot"
                        >
                            <Camera className="w-5 h-5" strokeWidth={1.5} />
                        </motion.button>

                        <motion.button
                            onClick={onNewRecording}
                            whileTap={springTap.whileTap}
                            data-tour="record"
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${isRecording
                                ? 'bg-crimson-glow text-crimson border border-crimson/30'
                                : 'bg-crimson text-white shadow-lg shadow-crimson/25 hover:shadow-crimson/40'
                                }`}
                            title={isRecording ? 'Stop Recording' : 'Start Recording'}
                        >
                            {isRecording ? (
                                <>
                                    <Square className="w-3.5 h-3.5" fill="currentColor" />
                                    Stop
                                </>
                            ) : (
                                <>
                                    <Circle className="w-3.5 h-3.5" fill="currentColor" />
                                    Record
                                </>
                            )}
                        </motion.button>
                    </div>

                    <div className="w-px h-6 bg-[var(--sv-glass-border)] mx-1" />

                    {/* Center: AI shield */}
                    <motion.button
                        onClick={onToggleBlur}
                        whileTap={springTap.whileTap}
                        data-tour="ai-shield"
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${isBlurActive
                            ? 'bg-emerald-glow text-emerald border border-emerald/20'
                            : 'hover:bg-[var(--sv-hover-overlay)] text-text-muted border border-transparent'
                            }`}
                        title={isBlurActive ? 'AI Privacy: Active' : 'AI Privacy: Off'}
                    >
                        <div className={`relative ${isBlurActive ? 'shield-glow' : ''}`}>
                            <Shield className="w-4 h-4" fill={isBlurActive ? 'currentColor' : 'none'} strokeWidth={1.5} />
                        </div>
                        <span className="hidden sm:inline">{isBlurActive ? 'AI Active' : 'AI Off'}</span>
                    </motion.button>

                    <div className="w-px h-6 bg-[var(--sv-glass-border)] mx-1" />

                    {/* Right: Timer + Mic */}
                    <div className="flex items-center gap-1">
                        {isRecording && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                            >
                                <div className="w-2 h-2 rounded-full bg-crimson rec-pulse" />
                                <span className="text-xs font-mono font-semibold text-text-primary tabular-nums">{formattedTime}</span>
                            </motion.div>
                        )}

                        <motion.button
                            whileTap={springTap.whileTap}
                            onClick={onToggleMute}
                            className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-[var(--sv-hover-overlay)] transition-all cursor-pointer"
                            title={isMuted ? 'Unmute' : 'Mute'}
                        >
                            {isMuted ? <MicOff className="w-4 h-4" strokeWidth={1.5} /> : <Mic className="w-4 h-4" strokeWidth={1.5} />}
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            {/* Status Bar */}
            <div className="flex items-center justify-between px-6 py-2">
                <div className="relative w-56">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-faint" strokeWidth={1.5} />
                    <input
                        type="text"
                        placeholder="Search recordings..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl glass-subtle text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:ring-2 focus:ring-indigo/30"
                    />
                </div>

                <motion.button
                    whileTap={springTap.whileTap}
                    onClick={onToggleNotifications}
                    className="relative p-2.5 rounded-xl text-text-muted hover:text-text-primary hover:bg-[var(--sv-hover-overlay)] transition-all cursor-pointer"
                    title="Notifications"
                >
                    <Bell className="w-5 h-5" strokeWidth={1.5} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-crimson rounded-full" />
                </motion.button>
            </div>
        </header>
    );
}
