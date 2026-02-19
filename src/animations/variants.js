/* ============================================
   SnapVault — Framer Motion Variant Library
   ============================================ */

// Page-level fade + slide-up transition
export const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
};

// Card hover — lift + glow
export const cardHover = {
    rest: {
        y: 0,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        transition: { duration: 0.2, ease: 'easeOut' },
    },
    hover: {
        y: -4,
        boxShadow: '0 12px 32px -8px rgba(0,0,0,0.25)',
        transition: { duration: 0.2, ease: 'easeOut' },
    },
};

// Button spring tap
export const springTap = {
    whileTap: { scale: 0.95 },
    transition: { type: 'spring', stiffness: 400, damping: 17 },
};

// Staggered grid entrance
export const staggerContainer = {
    animate: {
        transition: { staggerChildren: 0.06 },
    },
};

export const staggerItem = {
    initial: { opacity: 0, y: 16 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

// Shutter flash
export const shutterFlash = {
    initial: { opacity: 0 },
    animate: {
        opacity: [0, 0.92, 0],
        transition: { duration: 0.2, times: [0, 0.1, 1], ease: 'easeOut' },
    },
    exit: { opacity: 0 },
};

// Sound-wave rings (used with stagger)
export const soundWaveRing = (delay = 0) => ({
    initial: { scale: 1, opacity: 0.6 },
    animate: {
        scale: [1, 1.8, 2.5],
        opacity: [0.6, 0.2, 0],
        transition: { duration: 0.6, delay, ease: 'easeOut' },
    },
});

// Sidebar tooltip
export const sidebarTooltip = {
    initial: { opacity: 0, x: -4, scale: 0.96 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -4, scale: 0.96 },
    transition: { duration: 0.12 },
};

// Modal / overlay entrance
export const modalOverlay = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
};

export const modalContent = {
    initial: { opacity: 0, scale: 0.93, y: 16 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.93, y: 16 },
    transition: { type: 'spring', stiffness: 350, damping: 25 },
};

// Notification slide-in
export const notificationSlide = {
    initial: { opacity: 0, y: -8, scale: 0.96 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -8, scale: 0.96 },
    transition: { type: 'spring', stiffness: 400, damping: 25 },
};
