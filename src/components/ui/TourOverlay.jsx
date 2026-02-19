import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X, Sparkles } from 'lucide-react';

/**
 * Full-screen tour overlay with spotlight, tooltip, and progress dots.
 */
export default function TourOverlay({ isActive, currentStep, stepIndex, totalSteps, next, prev, skip }) {
    const [targetRect, setTargetRect] = useState(null);
    const tooltipRef = useRef(null);

    // Find and measure the target element
    useEffect(() => {
        if (!isActive || !currentStep?.target) {
            setTargetRect(null);
            return;
        }

        const el = document.querySelector(currentStep.target);
        if (el) {
            const rect = el.getBoundingClientRect();
            setTargetRect({
                top: rect.top - 8,
                left: rect.left - 8,
                width: rect.width + 16,
                height: rect.height + 16,
            });
            // Scroll element into view if needed
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            setTargetRect(null);
        }
    }, [isActive, currentStep, stepIndex]);

    if (!isActive) return null;

    const isCentered = !currentStep.target || !targetRect;
    const isLast = stepIndex === totalSteps - 1;
    const isFirst = stepIndex === 0;

    // Compute tooltip position
    let tooltipStyle = {};
    if (isCentered) {
        tooltipStyle = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    } else if (targetRect) {
        const { placement } = currentStep;
        switch (placement) {
            case 'bottom':
                tooltipStyle = { top: targetRect.top + targetRect.height + 16, left: targetRect.left + targetRect.width / 2, transform: 'translateX(-50%)' };
                break;
            case 'top':
                tooltipStyle = { bottom: window.innerHeight - targetRect.top + 16, left: targetRect.left + targetRect.width / 2, transform: 'translateX(-50%)' };
                break;
            case 'right':
                tooltipStyle = { top: targetRect.top + targetRect.height / 2, left: targetRect.left + targetRect.width + 16, transform: 'translateY(-50%)' };
                break;
            case 'left':
                tooltipStyle = { top: targetRect.top + targetRect.height / 2, right: window.innerWidth - targetRect.left + 16, transform: 'translateY(-50%)' };
                break;
            default:
                tooltipStyle = { top: targetRect.top + targetRect.height + 16, left: targetRect.left + targetRect.width / 2, transform: 'translateX(-50%)' };
        }
    }

    return (
        <AnimatePresence>
            <motion.div
                key="tour-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200]"
                style={{ pointerEvents: 'auto' }}
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={skip} />

                {/* Spotlight cutout */}
                {targetRect && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="absolute rounded-2xl"
                        style={{
                            top: targetRect.top,
                            left: targetRect.left,
                            width: targetRect.width,
                            height: targetRect.height,
                            boxShadow: '0 0 0 9999px rgba(0,0,0,0.55), 0 0 30px 4px rgba(99,102,241,0.3)',
                            borderRadius: 16,
                            border: '2px solid rgba(99,102,241,0.5)',
                        }}
                    />
                )}

                {/* Tooltip */}
                <motion.div
                    ref={tooltipRef}
                    key={stepIndex}
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    className="absolute z-[201] w-[380px] max-w-[90vw]"
                    style={tooltipStyle}
                >
                    <div className="bg-surface border border-border rounded-2xl p-6 relative"
                        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 30px rgba(99,102,241,0.15)' }}>
                        {/* Close button */}
                        <button
                            onClick={skip}
                            className="absolute top-4 right-4 p-1.5 rounded-lg text-text-faint hover:text-text-primary transition-colors cursor-pointer"
                            aria-label="Skip tour"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Icon for centered steps */}
                        {isCentered && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', delay: 0.1 }}
                                className="w-14 h-14 rounded-2xl bg-indigo-glow flex items-center justify-center mb-5"
                            >
                                <Sparkles className="w-7 h-7 text-indigo" />
                            </motion.div>
                        )}

                        {/* Content */}
                        <h3 className="text-base font-bold text-text-primary pr-8 mb-2">
                            {currentStep.title}
                        </h3>
                        <p className="text-sm text-text-muted leading-relaxed mb-6">
                            {currentStep.description}
                        </p>

                        {/* Footer: Navigation + Progress */}
                        <div className="flex items-center justify-between">
                            {/* Progress dots */}
                            <div className="flex items-center gap-1.5">
                                {Array.from({ length: totalSteps }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`rounded-full transition-all duration-200 ${i === stepIndex
                                                ? 'w-6 h-2 bg-indigo'
                                                : i < stepIndex
                                                    ? 'w-2 h-2 bg-indigo/40'
                                                    : 'w-2 h-2 bg-surface-overlay'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center gap-2">
                                {!isFirst && !isCentered && (
                                    <button
                                        onClick={prev}
                                        className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-text-muted hover:text-text-primary hover:bg-[var(--sv-hover-overlay)] transition-all cursor-pointer"
                                    >
                                        <ChevronLeft className="w-3.5 h-3.5" /> Back
                                    </button>
                                )}
                                <button
                                    onClick={next}
                                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo text-white hover:bg-indigo-hover transition-all cursor-pointer shadow-md shadow-indigo/25"
                                >
                                    {isLast ? 'Get Started' : isFirst ? 'Start Tour' : 'Next'}
                                    {!isLast && <ChevronRight className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
