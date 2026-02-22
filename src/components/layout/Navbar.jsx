import { motion } from 'framer-motion';
import { Camera, Square, Circle, Shield, Mic, MicOff, Search, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { springTap } from '../../animations/variants';

export default function Navbar({
    onNewRecording, onSnap, onToggleNotifications,
    isRecording, isMuted, onToggleMute,
    isBlurActive, onToggleBlur, formattedTime
}) {
    const { user, logout, setShowAuthModal, setAuthModalView } = useAuth();
    return (
        <header className="flex flex-col relative z-20">
            {/* Floating Zen Control Bar with explicit text & animations for visibility check */}
            <div className="flex items-center justify-center py-4 px-4">
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap items-center gap-2 sm:gap-4 px-4 py-2.5 rounded-2xl glass-strong shadow-lg"
                >
                    {/* Left: Snap */}
                    <motion.button
                        onClick={onSnap}
                        whileTap={springTap.whileTap}
                        data-tour="snap"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-raised hover:bg-surface-overlay border border-border-subtle text-text-primary transition-all cursor-pointer feature-pulse"
                        title="Snap Photo"
                        aria-label="Take screenshot"
                    >
                        <Camera className="w-5 h-5 text-primary" strokeWidth={2} />
                        <span className="hidden sm:inline font-medium text-sm">Take Snap</span>
                    </motion.button>

                    <div className="w-px h-8 bg-[var(--sv-glass-border)] mx-1" />

                    {/* Center: Record */}
                    <motion.button
                        onClick={onNewRecording}
                        whileTap={springTap.whileTap}
                        data-tour="record"
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${isRecording
                            ? 'bg-crimson-glow text-crimson border border-crimson/30 animate-pulse'
                            : 'bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 feature-pulse'
                            }`}
                        title={isRecording ? 'Stop Recording' : 'Start Recording'}
                    >
                        {isRecording ? (
                            <>
                                <Square className="w-4 h-4" fill="currentColor" />
                                Stop Recording
                            </>
                        ) : (
                            <>
                                <Circle className="w-4 h-4" fill="currentColor" />
                                Start Recording
                            </>
                        )}
                    </motion.button>

                    <div className="w-px h-8 bg-[var(--sv-glass-border)] mx-1" />

                    {/* Center Right: AI shield */}
                    <motion.button
                        onClick={onToggleBlur}
                        whileTap={springTap.whileTap}
                        data-tour="ai-shield"
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${isBlurActive
                            ? 'bg-emerald-glow text-emerald border border-emerald/20 shadow-[0_0_15px_var(--color-emerald-glow)]'
                            : 'bg-surface-raised hover:bg-surface-overlay border border-border-subtle text-text-muted hover:text-text-primary'
                            }`}
                        title={isBlurActive ? 'AI Privacy: Active' : 'AI Privacy: Off'}
                    >
                        <div className={`relative ${isBlurActive ? 'shield-glow' : ''}`}>
                            <Shield className="w-5 h-5" fill={isBlurActive ? 'currentColor' : 'none'} strokeWidth={isBlurActive ? 1.5 : 2} />
                        </div>
                        <span className="hidden md:inline">{isBlurActive ? 'Privacy Active' : 'Enable Privacy'}</span>
                    </motion.button>

                    {/* Right: Timer + Mic */}
                    <div className="flex items-center gap-3 pl-2 border-l border-[var(--sv-glass-border)]">
                        {isRecording && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface"
                            >
                                <div className="w-2.5 h-2.5 rounded-full bg-crimson rec-pulse" />
                                <span className="text-sm font-mono font-bold text-text-primary tabular-nums tracking-wider">{formattedTime}</span>
                            </motion.div>
                        )}

                        <motion.button
                            whileTap={springTap.whileTap}
                            onClick={onToggleMute}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-surface hover:bg-surface-raised border border-transparent hover:border-border-subtle text-text-muted hover:text-text-primary transition-all cursor-pointer"
                            title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
                        >
                            {isMuted ? <MicOff className="w-5 h-5 text-crimson" strokeWidth={2} /> : <Mic className="w-5 h-5" strokeWidth={2} />}
                            <span className="sr-only">{isMuted ? 'Unmute' : 'Mute'}</span>
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
                        className="w-full pl-9 pr-4 py-2 rounded-xl glass-subtle text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <motion.button
                        whileTap={springTap.whileTap}
                        onClick={onToggleNotifications}
                        className="relative p-2.5 rounded-xl text-text-muted hover:text-text-primary hover:bg-[var(--sv-hover-overlay)] transition-all cursor-pointer"
                        title="Notifications"
                    >
                        <Bell className="w-5 h-5" strokeWidth={1.5} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-crimson rounded-full" />
                    </motion.button>

                    {user ? (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold shadow-primary-glow">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <button
                                onClick={logout}
                                className="text-text-muted hover:text-crimson p-2 transition-colors cursor-pointer"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                setAuthModalView('login');
                                setShowAuthModal(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-border text-sm font-semibold hover:bg-surface-raised cursor-pointer transition-colors"
                        >
                            <User className="w-4 h-4" />
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
