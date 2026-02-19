import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import ChartWrapper from './ChartWrapper';
import { PieChart as PieIcon } from 'lucide-react';

/**
 * "Privacy Mix" — Donut chart showing distribution of detected secret categories.
 */
export default function PrivacyMix({ data, className = '' }) {
    const total = data.reduce((sum, d) => sum + d.value, 0);

    return (
        <ChartWrapper
            title="Privacy Mix"
            subtitle="Detection by category"
            icon={PieIcon}
            className={className}
        >
            <div className="flex items-center gap-8">
                <div className="w-40 h-40 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={46}
                                outerRadius={70}
                                paddingAngle={3}
                                dataKey="value"
                                stroke="none"
                                animationBegin={200}
                                animationDuration={800}
                            >
                                {data.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Custom legend */}
                <div className="flex-1 space-y-3">
                    {data.map((item) => {
                        const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
                        return (
                            <div key={item.name} className="flex items-center gap-3">
                                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                                <span className="text-xs font-medium text-text-secondary flex-1 truncate">{item.name}</span>
                                <span className="text-sm font-bold text-text-primary tabular-nums">{pct}%</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </ChartWrapper>
    );
}
