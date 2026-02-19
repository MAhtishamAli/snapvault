import { forwardRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Glassmorphism card — backdrop-blur, translucent bg, jewel-edge border, inset shine.
 * @param {{ variant?: 'default'|'subtle'|'strong', hover?: boolean, className?: string, children: React.ReactNode }} props
 */
const GlassCard = forwardRef(function GlassCard(
    { variant = 'default', hover = true, className = '', children, ...rest },
    ref
) {
    const variantClass = {
        default: 'glass',
        subtle: 'glass-subtle',
        strong: 'glass-strong',
    }[variant];

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`rounded-2xl ${variantClass} ${hover ? 'card-hover' : ''} ${className}`}
            {...rest}
        >
            {children}
        </motion.div>
    );
});

export default GlassCard;
