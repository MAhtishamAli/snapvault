import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, FolderOpen, ShieldCheck, Settings, ChevronRight, Layers } from 'lucide-react';

const navItems = [
    { icon: Home, label: 'Home', id: 'dashboard' },
    { icon: FolderOpen, label: 'Library', id: 'recordings' },
    { icon: ShieldCheck, label: 'AI-Redaction', id: 'privacy' },
    { icon: Settings, label: 'Integrations', id: 'settings' },
];

export default function Sidebar({ collapsed, onToggle, activePage, onNavigate }) {
    const [hoveredItem, setHoveredItem] = useState(null);

    return (
        <motion.aside
            animate={{ width: collapsed ? 64 : 220 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="relative h-screen flex flex-col py-3 glass-strong sidebar-anim z-30"
            style={{ borderRight: '1px solid var(--sv-glass-border)' }}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 mb-6 min-h-[40px]">
                <motion.div
                    whileHover={{ rotate: 12 }}
                    className="w-8 h-8 rounded-xl bg-indigo flex items-center justify-center shadow-md shadow-indigo/25 flex-shrink-0"
                >
                    <Layers className="w-4 h-4 text-white" strokeWidth={2.5} />
                </motion.div>
                <AnimatePresence>
                    {!collapsed && (
                        <motion.span
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            className="text-sm font-bold text-text-primary whitespace-nowrap"
                        >
                            Vault
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 space-y-0.5" role="navigation" aria-label="Main navigation" data-tour="sidebar">
                {navItems.map(({ icon: Icon, label, id }) => {
                    const isActive = activePage === id;
                    const isHovered = hoveredItem === id;

                    return (
                        <div key={id} className="relative">
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={() => onNavigate(id)}
                                onMouseEnter={() => setHoveredItem(id)}
                                onMouseLeave={() => setHoveredItem(null)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative cursor-pointer
                                    ${isActive
                                        ? 'text-indigo bg-indigo-glow'
                                        : 'text-text-muted hover:text-text-primary hover:bg-[var(--sv-hover-overlay)]'
                                    }`}
                                aria-current={isActive ? 'page' : undefined}
                                title={collapsed ? label : undefined}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={isActive ? 2 : 1.5} />
                                <AnimatePresence>
                                    {!collapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -6 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -6 }}
                                            className="text-sm font-medium whitespace-nowrap"
                                        >
                                            {label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>

                            {/* Tooltip when collapsed */}
                            <AnimatePresence>
                                {collapsed && isHovered && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -4 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -4 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 rounded-lg glass text-xs font-medium text-text-primary whitespace-nowrap z-50"
                                    >
                                        {label}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </nav>

            {/* Collapse toggle */}
            <div className="px-2 py-2">
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onToggle}
                    className="w-full flex items-center justify-center p-2 rounded-xl text-text-faint hover:text-text-primary hover:bg-[var(--sv-hover-overlay)] transition-all cursor-pointer"
                    title={collapsed ? 'Expand' : 'Collapse'}
                >
                    <motion.div animate={{ rotate: collapsed ? 0 : 180 }}>
                        <ChevronRight className="w-4 h-4" />
                    </motion.div>
                </motion.button>
            </div>
        </motion.aside>
    );
}
