import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, Video, Camera, Bell as BellIcon, Check } from 'lucide-react';
import { useState } from 'react';
import { notificationSlide } from '../../animations/variants';

const initialNotifs = [
    { id: 1, icon: ShieldAlert, title: '3 API keys detected', desc: 'Sprint Planning Call recording', time: '2 min ago', color: 'text-crimson', bg: 'bg-crimson-glow' },
    { id: 2, icon: Video, title: 'Recording saved', desc: 'Bug Fix Walkthrough — 12:42', time: '1 hour ago', color: 'text-emerald', bg: 'bg-emerald-glow' },
    { id: 3, icon: Camera, title: 'Snap captured', desc: 'Screenshot saved to library', time: '3 hours ago', color: 'text-indigo', bg: 'bg-indigo-glow' },
    { id: 4, icon: ShieldAlert, title: '7 secrets redacted', desc: 'API Key Review Session', time: 'Yesterday', color: 'text-crimson', bg: 'bg-crimson-glow' },
];

export default function NotificationPanel({ onClose }) {
    const [notifs, setNotifs] = useState(initialNotifs);
    const [unread, setUnread] = useState(new Set([1, 2]));

    const markAllRead = () => setUnread(new Set());
    const removeNotif = (id) => {
        setNotifs(prev => prev.filter(n => n.id !== id));
        setUnread(prev => { const s = new Set(prev); s.delete(id); return s; });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55]"
            onClick={onClose}
        >
            <motion.div
                {...notificationSlide}
                className="absolute top-32 right-8 w-96 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <div className="flex items-center gap-2.5">
                        <span className="text-sm font-semibold text-text-primary">Notifications</span>
                        {unread.size > 0 && <span className="px-2 py-0.5 rounded-full bg-indigo-glow text-indigo text-[10px] font-bold">{unread.size}</span>}
                    </div>
                    <div className="flex items-center gap-3">
                        {unread.size > 0 && (
                            <button onClick={markAllRead} className="text-xs text-indigo hover:text-indigo-hover transition-colors cursor-pointer">Mark read</button>
                        )}
                        <button onClick={onClose} className="p-1.5 rounded-lg text-text-faint hover:text-text-primary transition-colors cursor-pointer">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                    {notifs.length === 0 ? (
                        <div className="flex flex-col items-center py-12 text-text-faint">
                            <BellIcon className="w-7 h-7 mb-3 opacity-30" />
                            <p className="text-sm">All caught up!</p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {notifs.map(n => {
                                const Icon = n.icon;
                                return (
                                    <motion.div
                                        key={n.id}
                                        layout
                                        exit={{ opacity: 0, x: 40 }}
                                        className={`flex items-start gap-4 px-5 py-4 hover:bg-[var(--sv-hover-overlay)] transition-colors group ${unread.has(n.id) ? 'bg-indigo/[0.03]' : ''}`}
                                    >
                                        <div className={`p-2 rounded-xl ${n.bg} flex-shrink-0 mt-0.5`}>
                                            <Icon className={`w-4 h-4 ${n.color}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-[13px] font-semibold text-text-primary truncate">{n.title}</p>
                                                {unread.has(n.id) && <span className="w-2 h-2 rounded-full bg-indigo flex-shrink-0" />}
                                            </div>
                                            <p className="text-xs text-text-faint mt-1 truncate">{n.desc}</p>
                                            <p className="text-[11px] text-text-faint mt-1.5">{n.time}</p>
                                        </div>
                                        <button onClick={() => removeNotif(n.id)} className="p-1.5 rounded-lg text-text-faint hover:text-crimson transition-colors opacity-0 group-hover:opacity-100 cursor-pointer flex-shrink-0">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
