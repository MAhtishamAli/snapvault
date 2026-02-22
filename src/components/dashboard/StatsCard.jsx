import { motion } from 'framer-motion';
import GlassCard from '../glass/GlassCard';

export default function StatsCard({ icon: Icon, title, value, subtitle, accentColor = 'indigo', trend, index = 0 }) {
    const colorMap = {
        indigo: { bg: 'bg-primary-glow', text: 'text-primary', accent: '#4f46e5' },
        teal: { bg: 'bg-teal-glow', text: 'text-teal', accent: '#06b6d4' },
        crimson: { bg: 'bg-crimson-glow', text: 'text-crimson', accent: '#fb7185' },
        emerald: { bg: 'bg-emerald-glow', text: 'text-emerald', accent: '#10b981' },
    };
    const c = colorMap[accentColor] || colorMap.indigo;

    return (
        <GlassCard
            transition={{ duration: 0.35, delay: index * 0.08 }}
            className="overflow-hidden"
        >
            {/* Accent strip */}
            <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${c.accent}, ${c.accent}44)` }} />

            <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-xl ${c.bg}`}>
                        <Icon className={`w-5 h-5 ${c.text}`} strokeWidth={1.8} />
                    </div>
                    {trend && (
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${c.bg} ${c.text}`}>
                            {trend}
                        </span>
                    )}
                </div>
                <p className="text-3xl font-bold text-text-primary tracking-tight tabular-nums">{value}</p>
                <p className="text-sm text-text-muted mt-1">{title}</p>
                {subtitle && (
                    <p className="text-xs text-text-faint mt-3 pt-3 border-t border-border">{subtitle}</p>
                )}
            </div>
        </GlassCard>
    );
}
