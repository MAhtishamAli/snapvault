import { motion, AnimatePresence } from 'framer-motion';
import { shutterFlash, soundWaveRing } from '../../animations/variants';

export default function CapturePreview({ showFlash }) {
    return (
        <AnimatePresence>
            {showFlash && (
                <motion.div
                    key="shutter"
                    className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
                >
                    {/* White/dark flash */}
                    <motion.div
                        {...shutterFlash}
                        className="absolute inset-0 bg-[var(--sv-shutter-color)]"
                    />

                    {/* Sound-wave rings */}
                    <div className="relative w-32 h-32">
                        {[0, 1, 2].map(i => (
                            <motion.div
                                key={i}
                                {...soundWaveRing(i * 0.08)}
                                className="absolute inset-0 rounded-full border-2 border-indigo"
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
