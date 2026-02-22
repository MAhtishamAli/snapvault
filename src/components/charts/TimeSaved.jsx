import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ChartWrapper from './ChartWrapper';
import { useThemeContext } from '../layout/ThemeProvider';
import { TrendingDown } from 'lucide-react';

/**
 * "Time Saved" — Bar chart comparing manual editing vs. SnapVault auto-redaction time.
 */
export default function TimeSaved({ data, className = '' }) {
    const { theme } = useThemeContext();
    const isDark = theme === 'dark';

    const gridColor = isDark ? '#1e293b' : '#e2e8f0';
    const tickColor = isDark ? '#94a3b8' : '#64748b';
    const tooltipBg = isDark ? '#0f172a' : '#ffffff';
    const tooltipBorder = isDark ? '#1e293b' : '#cbd5e1';

    return (
        <ChartWrapper
            title="Time Saved"
            subtitle="Manual editing vs. SnapVault AI (minutes)"
            icon={TrendingDown}
            className={className}
        >
            <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }} barGap={6}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: tickColor, fontWeight: 500 }}
                        axisLine={false}
                        tickLine={false}
                        dy={8}
                    />
                    <YAxis
                        tick={{ fontSize: 11, fill: tickColor, fontWeight: 500 }}
                        axisLine={false}
                        tickLine={false}
                        dx={-4}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: tooltipBg,
                            border: `1px solid ${tooltipBorder}`,
                            borderRadius: 12,
                            fontSize: 13,
                            fontWeight: 500,
                            padding: '10px 14px',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        }}
                        labelStyle={{ fontWeight: 700, marginBottom: 6, fontSize: 12 }}
                        formatter={(value, name) => [
                            `${value} min`,
                            name === 'manual' ? 'Manual Edit' : 'SnapVault AI',
                        ]}
                    />
                    <Legend
                        iconType="circle"
                        iconSize={10}
                        wrapperStyle={{ fontSize: 12, fontWeight: 500, paddingTop: 12 }}
                        formatter={(val) => (val === 'manual' ? 'Manual Edit' : 'SnapVault AI')}
                    />
                    <Bar dataKey="manual" fill={isDark ? '#334155' : '#94a3b8'} radius={[8, 8, 0, 0]} maxBarSize={40} animationBegin={200} animationDuration={800} />
                    <Bar dataKey="automated" fill="#4f46e5" radius={[8, 8, 0, 0]} maxBarSize={40} animationBegin={400} animationDuration={800} />
                </BarChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
}
