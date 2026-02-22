import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartWrapper from './ChartWrapper';
import { useThemeContext } from '../layout/ThemeProvider';
import { Activity } from 'lucide-react';

/**
 * "Security Pulse" — Area chart showing secrets detected vs. blurred over 30 days.
 */
export default function SecurityPulse({ data, className = '' }) {
    const { theme } = useThemeContext();
    const isDark = theme === 'dark';

    const gridColor = isDark ? '#1e293b' : '#e2e8f0';
    const tickColor = isDark ? '#94a3b8' : '#64748b';
    const tooltipBg = isDark ? '#0f172a' : '#ffffff';
    const tooltipBorder = isDark ? '#1e293b' : '#cbd5e1';

    return (
        <ChartWrapper
            title="Security Pulse"
            subtitle="Detected vs. auto-blurred — 30 days"
            icon={Activity}
            className={className}
        >
            <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                    <defs>
                        <linearGradient id="gradDetected" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradBlurred" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: tickColor, fontWeight: 500 }}
                        axisLine={false}
                        tickLine={false}
                        interval="preserveStartEnd"
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
                    />
                    <Area type="monotone" dataKey="detected" stroke="#06b6d4" strokeWidth={2.5} fill="url(#gradDetected)" name="Detected" dot={false} activeDot={{ r: 5, fill: '#06b6d4', stroke: tooltipBg, strokeWidth: 2 }} />
                    <Area type="monotone" dataKey="blurred" stroke="#10b981" strokeWidth={2.5} fill="url(#gradBlurred)" name="Auto-Blurred" dot={false} activeDot={{ r: 5, fill: '#10b981', stroke: tooltipBg, strokeWidth: 2 }} />
                </AreaChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
}
