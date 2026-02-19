import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const variants = {
    primary: 'bg-indigo text-white hover:bg-indigo-hover shadow-md shadow-indigo/20 hover:shadow-indigo/30',
    danger: 'bg-crimson text-white hover:bg-crimson-dark shadow-md shadow-crimson/20',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-[var(--sv-hover-overlay)]',
    outline: 'border border-border-subtle text-text-secondary hover:text-text-primary hover:bg-[var(--sv-hover-overlay)] hover:border-text-muted',
    safe: 'bg-emerald/10 text-emerald border border-emerald/20 hover:bg-emerald/20',
};

const sizes = {
    sm: 'px-3.5 py-2 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3 text-sm gap-2.5',
};

const Button = forwardRef(({ variant = 'primary', size = 'md', loading, disabled, children, className = '', ...props }, ref) => {
    return (
        <motion.button
            ref={ref}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            disabled={disabled || loading}
            className={`inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-base disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {children}
        </motion.button>
    );
});

Button.displayName = 'Button';
export default Button;
