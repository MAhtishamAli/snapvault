import { motion } from 'framer-motion';
import { Camera, Square, Shield, CheckCircle2, Circle } from 'lucide-react';
import GlassCard from '../glass/GlassCard';

export default function ChecklistCard({ onSnap, onRecord, onShield, snapDone, recordDone, shieldDone }) {
    const tasks = [
        {
            id: 'snap',
            title: 'Take your first Snap',
            description: 'Click to capture a screenshot',
            icon: Camera,
            done: snapDone,
            action: onSnap,
            color: 'primary'
        },
        {
            id: 'record',
            title: 'Start a Recording',
            description: 'Click to start recording your screen',
            icon: Circle,
            done: recordDone,
            action: onRecord,
            color: 'teal'
        },
        {
            id: 'shield',
            title: 'Enable AI Shield',
            description: 'Toggle AI-powered privacy protection',
            icon: Shield,
            done: shieldDone,
            action: onShield,
            color: 'emerald'
        }
    ];

    const allDone = tasks.every(t => t.done);

    if (allDone) return null;

    return (
        <GlassCard transition={{ duration: 0.4 }} className="overflow-hidden mb-8 border-primary/30 shadow-primary-glow border-2">
            <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-text-primary tracking-tight">Getting Started Checklist</h2>
                        <p className="text-sm text-text-muted mt-1">Complete these actions to master SnapVault.</p>
                    </div>
                    <div className="hidden sm:flex items-center justify-center bg-primary-glow text-primary font-bold text-sm px-3 py-1 rounded-full">
                        {tasks.filter(t => t.done).length} / {tasks.length} Completed
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    {tasks.map((task, i) => {
                        const Icon = task.icon;
                        return (
                            <motion.button
                                key={task.id}
                                whileHover={{ scale: task.done ? 1 : 1.02, y: task.done ? 0 : -2 }}
                                whileTap={{ scale: task.done ? 1 : 0.98 }}
                                onClick={task.action}
                                disabled={task.done}
                                className={`flex items-start text-left gap-4 p-4 rounded-xl border transition-all ${task.done
                                    ? 'bg-surface-overlay border-transparent opacity-60'
                                    : 'bg-surface hover:bg-surface-raised border-border hover:border-primary/40 cursor-pointer shadow-sm relative overflow-hidden group'
                                    }`}
                            >
                                {!task.done && (
                                    <div className={`absolute inset-0 bg-${task.color}-glow opacity-0 group-hover:opacity-10 transition-opacity`} />
                                )}
                                <div className={`p-2.5 rounded-xl shrink-0 ${task.done ? 'bg-surface text-text-muted' : `bg-${task.color}-glow text-${task.color}`}`}>
                                    {task.done ? <CheckCircle2 className="w-5 h-5 text-emerald" /> : <Icon className="w-5 h-5" strokeWidth={1.8} />}
                                </div>
                                <div>
                                    <h3 className={`font-semibold text-sm ${task.done ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                                        {task.title}
                                    </h3>
                                    <p className="text-xs text-text-faint mt-1">{task.description}</p>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </GlassCard>
    );
}
