import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useEffect } from 'react';

const icons = {
    success: { Icon: CheckCircle, color: 'text-emerald', bg: 'bg-emerald/10', border: 'border-emerald/20' },
    error: { Icon: AlertTriangle, color: 'text-crimson', bg: 'bg-crimson/10', border: 'border-crimson/20' },
    info: { Icon: Info, color: 'text-indigo', bg: 'bg-indigo/10', border: 'border-indigo/20' },
};

export default function Toast({ id, message, type = 'success', onDismiss }) {
    useEffect(() => {
        const timer = setTimeout(() => onDismiss(id), 3500);
        return () => clearTimeout(timer);
    }, [id, onDismiss]);

    const c = icons[type] || icons.info;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border ${c.bg} ${c.border} shadow-2xl backdrop-blur-md min-w-[320px] max-w-sm`}
        >
            <c.Icon className={`w-5 h-5 ${c.color} flex-shrink-0`} />
            <p className="text-sm font-medium text-text-primary flex-1">{message}</p>
            <button onClick={() => onDismiss(id)} className="p-1 rounded-lg text-text-muted hover:text-text-primary transition-colors cursor-pointer flex-shrink-0">
                <X className="w-3.5 h-3.5" />
            </button>
        </motion.div>
    );
}

export function ToastContainer({ toasts, onDismiss }) {
    return (
        <div className="fixed top-24 right-8 z-[70] space-y-3">
            <AnimatePresence mode="popLayout">
                {toasts.map(t => (
                    <Toast key={t.id} {...t} onDismiss={onDismiss} />
                ))}
            </AnimatePresence>
        </div>
    );
}
