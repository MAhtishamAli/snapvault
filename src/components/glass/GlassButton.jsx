import { forwardRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Glassmorphism button — translucent blur, jewel-edge, spring-tap.
 * @param {{ variant?: 'default'|'primary'|'danger', size?: 'sm'|'md'|'lg', className?: string, children: React.ReactNode }} props
 */
const GlassButton = forwardRef(function GlassButton(
    { variant = 'default', size = 'md', className = '', children, ...rest },
    ref
) {
    const variants = {
        default: 'glass-subtle text-text-primary hover:bg-[var(--sv-hover-overlay)]',
        primary: 'bg-indigo text-white shadow-lg shadow-indigo/25 hover:shadow-indigo/40 hover:bg-indigo-hover',
        danger: 'bg-crimson text-white shadow-lg shadow-crimson/25 hover:shadow-crimson/40 hover:bg-crimson-hover',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs gap-1.5',
        md: 'px-5 py-2.5 text-sm gap-2',
        lg: 'px-6 py-3 text-base gap-2.5',
    };

    return (
        <motion.button
            ref={ref}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={`inline-flex items-center justify-center font-semibold rounded-xl cursor-pointer transition-all
                ${variants[variant]} ${sizes[size]} ${className}`}
            {...rest}
        >
            {children}
        </motion.button>
    );
});

export default GlassButton;
