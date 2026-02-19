import { motion } from 'framer-motion';
import GlassCard from '../glass/GlassCard';

/**
 * Reusable chart card container — glassmorphism with icon header.
 */
export default function ChartWrapper({ title, subtitle, icon: Icon, action, className = '', children }) {
    return (
        <GlassCard hover={false} className={className}>
            <div className="flex items-center justify-between px-5 sm:px-6 pt-5 pb-3">
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div className="p-2 rounded-xl bg-indigo-glow">
                            <Icon className="w-4 h-4 text-indigo" strokeWidth={1.8} />
                        </div>
                    )}
                    <div>
                        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
                        {subtitle && <p className="text-[11px] text-text-faint mt-0.5">{subtitle}</p>}
                    </div>
                </div>
                {action && <div>{action}</div>}
            </div>
            <div className="px-5 sm:px-6 pb-5">
                {children}
            </div>
        </GlassCard>
    );
}
