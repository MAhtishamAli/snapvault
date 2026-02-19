import { motion } from 'framer-motion';
import { useState } from 'react';
import { Settings, Camera, Shield, Bell, Database, Palette, ChevronRight, Save, Check, Moon, Sun, Monitor, HardDrive, Trash2, Download, ToggleLeft, ToggleRight } from 'lucide-react';
import Button from '../ui/Button';
import { useThemeContext } from '../layout/ThemeProvider';
import { pageTransition } from '../../animations/variants';

const sections = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'recording', label: 'Recording', icon: Camera },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'storage', label: 'Storage', icon: Database },
    { id: 'appearance', label: 'Appearance', icon: Palette },
];

export default function SettingsPage({ onToast }) {
    const { preference, setTheme } = useThemeContext();
    const [activeSection, setActiveSection] = useState('general');
    const [s, setS] = useState({
        userName: 'SnapVault User', email: 'user@snapvault.io',
        autoRecord: false, recordAudio: true, recordWebcam: false,
        recordResolution: '1080p', fps: '30', format: 'webm',
        autoBlur: true, blurIntensity: 75, aiDetection: true, encryptLocal: true,
        notifyOnDetection: true, notifyOnComplete: true, soundEffects: true, desktopNotifs: true,
        storagePath: '/home/user/SnapVault', autoCleanup: false, cleanupDays: 30, maxStorage: 50,
        compactMode: false, animations: true,
    });
    const [saved, setSaved] = useState(false);

    const u = (k, v) => { setS(p => ({ ...p, [k]: v })); setSaved(false); };
    const handleSave = () => { setSaved(true); onToast?.('Settings saved'); setTimeout(() => setSaved(false), 2000); };

    const Toggle = ({ value, onChange }) => (
        <button onClick={() => onChange(!value)} className="cursor-pointer hover:scale-105 transition-transform">
            {value ? <ToggleRight className="w-8 h-8 text-indigo" /> : <ToggleLeft className="w-8 h-8 text-text-faint" />}
        </button>
    );

    const ToggleRow = ({ label, desc, k }) => (
        <div className="flex items-center justify-between p-5 rounded-2xl bg-surface border border-border">
            <div><p className="text-sm font-semibold text-text-primary">{label}</p><p className="text-xs text-text-faint mt-1">{desc}</p></div>
            <Toggle value={s[k]} onChange={v => u(k, v)} />
        </div>
    );

    const OptionGroup = ({ label, options, value, onChange, uppercase }) => (
        <div>
            <label className="text-xs font-medium text-text-muted mb-2.5 block">{label}</label>
            <div className="flex gap-3 flex-wrap">
                {options.map(o => (
                    <button key={o} onClick={() => onChange(o)}
                        className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${uppercase ? 'uppercase' : ''} ${value === o ? 'bg-indigo-glow text-indigo border border-indigo/25' : 'bg-base border border-border text-text-faint hover:text-text-secondary'}`}>{o}{label === 'Frame Rate' ? ' FPS' : ''}</button>
                ))}
            </div>
        </div>
    );

    const render = () => {
        switch (activeSection) {
            case 'general': return (
                <div className="space-y-5">
                    <h2 className="text-base font-bold text-text-primary">General</h2>
                    <div className="p-6 rounded-2xl bg-surface border border-border space-y-5">
                        {[['Display Name', 'userName'], ['Email', 'email']].map(([l, k]) => (
                            <div key={k}><label className="text-xs font-medium text-text-muted mb-2 block">{l}</label>
                                <input type="text" value={s[k]} onChange={e => u(k, e.target.value)}
                                    className="w-full max-w-sm px-4 py-2.5 rounded-xl bg-base border border-border text-sm text-text-primary outline-none focus:border-indigo/50 transition-colors" /></div>
                        ))}
                    </div>
                </div>);
            case 'recording': return (
                <div className="space-y-4">
                    <h2 className="text-base font-bold text-text-primary">Recording</h2>
                    <ToggleRow label="Auto-start Recording" desc="Begin recording when SnapVault launches" k="autoRecord" />
                    <ToggleRow label="Record Audio" desc="Capture microphone and system audio" k="recordAudio" />
                    <ToggleRow label="Record Webcam" desc="Include webcam overlay" k="recordWebcam" />
                    <div className="p-6 rounded-2xl bg-surface border border-border space-y-5">
                        <OptionGroup label="Resolution" options={['720p', '1080p', '1440p', '4K']} value={s.recordResolution} onChange={v => u('recordResolution', v)} />
                        <OptionGroup label="Frame Rate" options={['24', '30', '60']} value={s.fps} onChange={v => u('fps', v)} />
                        <OptionGroup label="Format" options={['webm', 'mp4', 'mkv']} value={s.format} onChange={v => u('format', v)} uppercase />
                    </div>
                </div>);
            case 'privacy': return (
                <div className="space-y-4">
                    <h2 className="text-base font-bold text-text-primary">Privacy & Security</h2>
                    <ToggleRow label="Auto-Redact Secrets" desc="AI detects and redacts sensitive content" k="autoBlur" />
                    <ToggleRow label="AI Detection Engine" desc="ML-enhanced detection accuracy" k="aiDetection" />
                    <ToggleRow label="Encrypt Local Storage" desc="AES-256 encryption for all recordings" k="encryptLocal" />
                    {s.autoBlur && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-6 rounded-2xl bg-surface border border-border">
                            <label className="text-xs font-medium text-text-muted mb-4 block">Redaction Intensity: {s.blurIntensity}%</label>
                            <input type="range" min="10" max="100" value={s.blurIntensity} onChange={e => u('blurIntensity', parseInt(e.target.value))} className="w-full max-w-sm" />
                        </motion.div>
                    )}
                </div>);
            case 'notifications': return (
                <div className="space-y-4">
                    <h2 className="text-base font-bold text-text-primary">Notifications</h2>
                    <ToggleRow label="Detection Alerts" desc="Notify when secrets are found" k="notifyOnDetection" />
                    <ToggleRow label="Recording Complete" desc="Notification when saving finishes" k="notifyOnComplete" />
                    <ToggleRow label="Sound Effects" desc="Sounds for recording start/stop" k="soundEffects" />
                    <ToggleRow label="Desktop Notifications" desc="OS-level notifications" k="desktopNotifs" />
                </div>);
            case 'storage': return (
                <div className="space-y-5">
                    <h2 className="text-base font-bold text-text-primary">Storage</h2>
                    <div className="p-6 rounded-2xl bg-surface border border-border space-y-5">
                        <div className="flex items-center justify-between">
                            <div><p className="text-sm font-semibold text-text-primary">8.6 GB of {s.maxStorage} GB</p><p className="text-xs text-text-faint mt-1">24 recordings</p></div>
                            <HardDrive className="w-6 h-6 text-indigo" />
                        </div>
                        <div className="w-full h-2 bg-base rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${(8.6 / s.maxStorage) * 100}%` }} transition={{ duration: 0.8 }} className="h-full bg-indigo rounded-full" />
                        </div>
                    </div>
                    <div><label className="text-xs font-medium text-text-muted mb-2 block">Storage Path</label>
                        <input type="text" value={s.storagePath} onChange={e => u('storagePath', e.target.value)}
                            className="w-full max-w-lg px-4 py-2.5 rounded-xl bg-base border border-border text-sm text-text-primary font-mono outline-none focus:border-indigo/50 transition-colors" /></div>
                    <ToggleRow label="Auto Cleanup" desc={`Remove recordings older than ${s.cleanupDays} days`} k="autoCleanup" />
                    <div className="flex gap-4">
                        <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5" /> Export All</Button>
                        <Button variant="danger" size="sm"><Trash2 className="w-3.5 h-3.5" /> Clear Cache</Button>
                    </div>
                </div>);
            case 'appearance': return (
                <div className="space-y-4">
                    <h2 className="text-base font-bold text-text-primary">Appearance</h2>
                    <div className="p-6 rounded-2xl bg-surface border border-border">
                        <label className="text-xs font-medium text-text-muted mb-3 block">Theme</label>
                        <div className="flex gap-3">
                            {[{ id: 'dark', icon: Moon, label: 'Dark' }, { id: 'light', icon: Sun, label: 'Light' }, { id: 'system', icon: Monitor, label: 'System' }].map(t => (
                                <button key={t.id} onClick={() => setTheme(t.id)}
                                    className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${preference === t.id ? 'bg-indigo-glow text-indigo border border-indigo/25' : 'bg-base border border-border text-text-faint'}`}>
                                    <t.icon className="w-4 h-4" />{t.label}</button>
                            ))}
                        </div>
                    </div>
                    <ToggleRow label="Compact Mode" desc="Denser view with reduced spacing" k="compactMode" />
                    <ToggleRow label="Animations" desc="Smooth transitions and micro-interactions" k="animations" />
                </div>);
        }
    };

    return (
        <motion.div {...pageTransition}
            className="flex gap-8 h-full">
            <div className="w-52 flex-shrink-0 space-y-1">
                {sections.map(sec => {
                    const Icon = sec.icon;
                    return (
                        <button key={sec.id} onClick={() => setActiveSection(sec.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer relative ${activeSection === sec.id ? 'bg-indigo-glow text-indigo' : 'text-text-faint hover:text-text-secondary hover:bg-[var(--sv-hover-overlay)]'}`}>
                            <Icon className="w-[18px] h-[18px]" /><span>{sec.label}</span>
                            {activeSection === sec.id && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
                        </button>
                    );
                })}
            </div>
            <div className="flex-1 min-w-0">
                <motion.div key={activeSection} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                    {render()}
                </motion.div>
                <div className="mt-8 flex justify-end">
                    <Button onClick={handleSave} variant={saved ? 'safe' : 'primary'}>
                        {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save</>}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
