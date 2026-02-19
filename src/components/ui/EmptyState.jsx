import { motion } from 'framer-motion';
import { Camera, Shield } from 'lucide-react';
import Button from './Button';

export default function EmptyState({ type = 'recordings', onAction }) {
    const config = {
        recordings: {
            title: 'No recordings yet',
            desc: 'Start your first secure recording and it will appear here.',
            action: 'Start Recording',
            icon: Camera,
        },
        library: {
            title: 'Your library is empty',
            desc: 'Captured snaps and recordings will show up here.',
            action: 'Take a Snap',
            icon: Camera,
        },
        rules: {
            title: 'No redaction rules',
            desc: 'Create your first AI-powered privacy rule to start protecting sensitive data.',
            action: 'Create Rule',
            icon: Shield,
        },
    };

    const c = config[type] || config.recordings;
    const Icon = c.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col items-center justify-center py-32 px-8"
        >
            {/* Animated illustration */}
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1, type: 'spring', stiffness: 200 }}
                className="relative mb-10"
            >
                <div className="w-28 h-28 rounded-3xl bg-surface border border-border flex items-center justify-center">
                    <Icon className="w-12 h-12 text-text-faint" strokeWidth={1.5} />
                </div>
                {/* Decorative rings */}
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 rounded-3xl border border-indigo/20"
                    style={{ margin: '-10px' }}
                />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.05, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                    className="absolute inset-0 rounded-3xl border border-indigo/10"
                    style={{ margin: '-20px' }}
                />
            </motion.div>

            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-semibold text-text-primary mb-3"
            >
                {c.title}
            </motion.h2>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-text-muted text-center max-w-sm mb-10"
            >
                {c.desc}
            </motion.p>
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Button onClick={onAction} size="lg">
                    <Icon className="w-4 h-4" />
                    {c.action}
                </Button>
            </motion.div>
        </motion.div>
    );
}
