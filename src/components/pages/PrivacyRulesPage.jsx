import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Shield, Key, Mail, CreditCard, Globe, FileText, Plus, Trash2, Search, Eye, X, ToggleLeft, ToggleRight } from 'lucide-react';
import Button from '../ui/Button';
import { pageTransition } from '../../animations/variants';

const defaultRules = [
    { id: 1, name: 'API Keys & Tokens', description: 'Detects and redacts API keys, tokens, and secrets', icon: Key, category: 'secrets', enabled: true, detections: 47 },
    { id: 2, name: 'Email Addresses', description: 'Automatically redacts email addresses', icon: Mail, category: 'pii', enabled: true, detections: 23 },
    { id: 3, name: 'Credit Card Numbers', description: 'Masks credit card numbers and CVV codes', icon: CreditCard, category: 'financial', enabled: true, detections: 5 },
    { id: 4, name: 'URLs & Endpoints', description: 'Hides internal API endpoints and staging URLs', icon: Globe, category: 'secrets', enabled: false, detections: 89 },
    { id: 5, name: 'Passwords in Forms', description: 'Detects password fields and login forms', icon: Key, category: 'secrets', enabled: true, detections: 31 },
    { id: 6, name: 'Personal Identity', description: 'Redacts names, phone numbers, and addresses', icon: FileText, category: 'pii', enabled: true, detections: 12 },
    { id: 7, name: 'AWS Access Keys', description: 'Targets AWS access key patterns', icon: Key, category: 'secrets', enabled: true, detections: 8 },
    { id: 8, name: 'Database Credentials', description: 'Detects connection strings and DB passwords', icon: Key, category: 'secrets', enabled: true, detections: 15 },
];

const categories = [
    { id: 'all', label: 'All' },
    { id: 'secrets', label: 'Secrets' },
    { id: 'pii', label: 'PII' },
    { id: 'financial', label: 'Financial' },
];

export default function PrivacyRulesPage({ onToast }) {
    const [rules, setRules] = useState(defaultRules);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [newRule, setNewRule] = useState({ name: '', description: '', category: 'secrets' });

    const filtered = rules.filter(r => {
        const matchCat = activeCategory === 'all' || r.category === activeCategory;
        const matchSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
    });

    const toggleRule = (id) => {
        setRules(prev => prev.map(r => {
            if (r.id === id) { const v = !r.enabled; onToast?.(`${r.name} ${v ? 'enabled' : 'disabled'}`); return { ...r, enabled: v }; }
            return r;
        }));
    };

    const deleteRule = (id) => {
        const rule = rules.find(r => r.id === id);
        setRules(prev => prev.filter(r => r.id !== id));
        onToast?.(`"${rule?.name}" deleted`);
    };

    const addRule = () => {
        if (!newRule.name.trim()) return;
        setRules(prev => [...prev, { id: Date.now(), ...newRule, icon: Shield, enabled: true, detections: 0 }]);
        setShowAdd(false);
        setNewRule({ name: '', description: '', category: 'secrets' });
        onToast?.(`Rule added`);
    };

    const enabled = rules.filter(r => r.enabled).length;
    const totalDet = rules.reduce((s, r) => s + r.detections, 0);

    return (
        <motion.div {...pageTransition} className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-emerald-glow"><Shield className="w-5 h-5 text-emerald" /></div>
                        AI-Redaction Rules
                    </h1>
                    <p className="text-sm text-text-faint mt-2">{enabled} active · {totalDet} detections</p>
                </div>
                <Button onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> Add Rule</Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
                {[
                    { label: 'Active', value: enabled, color: 'text-emerald' },
                    { label: 'Detections', value: totalDet, color: 'text-indigo' },
                    { label: 'Disabled', value: rules.length - enabled, color: 'text-crimson' },
                ].map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                        className="p-6 rounded-2xl bg-surface border border-border">
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-text-faint mt-2">{s.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-base border border-border flex-1 max-w-xs transition-all focus-within:border-indigo/40">
                    <Search className="w-4 h-4 text-text-faint" />
                    <input type="text" placeholder="Search rules..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className="bg-transparent text-sm text-text-primary placeholder:text-text-faint outline-none w-full" />
                </div>
                <div className="flex items-center gap-1 rounded-xl border border-border p-1.5">
                    {categories.map(c => (
                        <button key={c.id} onClick={() => setActiveCategory(c.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${activeCategory === c.id ? 'bg-indigo-glow text-indigo' : 'text-text-faint hover:text-text-secondary'}`}>
                            {c.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Rules */}
            <div className="space-y-3">
                <AnimatePresence>
                    {filtered.map((rule, i) => {
                        const Icon = rule.icon;
                        return (
                            <motion.div key={rule.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ delay: i * 0.03 }}
                                className={`flex items-center gap-5 p-5 rounded-2xl bg-surface border transition-all group ${rule.enabled ? 'border-border hover:border-indigo/20' : 'border-border opacity-50'}`}>
                                <div className={`p-2.5 rounded-xl ${rule.enabled ? 'bg-indigo-glow' : 'bg-[var(--sv-hover-overlay)]'}`}>
                                    <Icon className={`w-[18px] h-[18px] ${rule.enabled ? 'text-indigo' : 'text-text-faint'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold text-text-primary">{rule.name}</h3>
                                    <p className="text-xs text-text-faint mt-1 truncate">{rule.description}</p>
                                </div>
                                <span className="text-xs text-text-faint flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />{rule.detections}</span>
                                <span className={`px-2 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider ${rule.category === 'secrets' ? 'bg-crimson-glow text-crimson' : rule.category === 'pii' ? 'bg-amber/10 text-amber' : 'bg-indigo-glow text-indigo'}`}>{rule.category}</span>
                                <button onClick={() => toggleRule(rule.id)} className="cursor-pointer hover:scale-105 transition-transform">
                                    {rule.enabled ? <ToggleRight className="w-8 h-8 text-indigo" /> : <ToggleLeft className="w-8 h-8 text-text-faint" />}
                                </button>
                                <button onClick={() => deleteRule(rule.id)} className="p-2 rounded-xl text-text-faint hover:text-crimson hover:bg-crimson-glow transition-all opacity-0 group-hover:opacity-100 cursor-pointer">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Add Modal */}
            <AnimatePresence>
                {showAdd && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAdd(false)}>
                        <motion.div initial={{ scale: 0.93, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93, y: 12 }} transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                            className="w-full max-w-md bg-surface border border-border rounded-2xl p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-base font-bold text-text-primary">Add Redaction Rule</h2>
                                <button onClick={() => setShowAdd(false)} className="p-1.5 rounded-lg text-text-faint hover:text-text-primary transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
                            </div>
                            <div className="space-y-5">
                                <div>
                                    <label className="text-xs font-medium text-text-muted mb-2 block">Name</label>
                                    <input type="text" value={newRule.name} onChange={e => setNewRule(p => ({ ...p, name: e.target.value }))} placeholder="e.g., SSH Private Keys"
                                        className="w-full px-4 py-3 rounded-xl bg-base border border-border text-sm text-text-primary placeholder:text-text-faint outline-none focus:border-indigo/50 transition-colors" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-text-muted mb-2 block">Description</label>
                                    <input type="text" value={newRule.description} onChange={e => setNewRule(p => ({ ...p, description: e.target.value }))} placeholder="What it detects..."
                                        className="w-full px-4 py-3 rounded-xl bg-base border border-border text-sm text-text-primary placeholder:text-text-faint outline-none focus:border-indigo/50 transition-colors" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-text-muted mb-2 block">Category</label>
                                    <div className="flex gap-3">
                                        {['secrets', 'pii', 'financial'].map(c => (
                                            <button key={c} onClick={() => setNewRule(p => ({ ...p, category: c }))}
                                                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer capitalize ${newRule.category === c ? 'bg-indigo-glow text-indigo border border-indigo/25' : 'bg-base border border-border text-text-faint'}`}>{c}</button>
                                        ))}
                                    </div>
                                </div>
                                <Button onClick={addRule} disabled={!newRule.name.trim()} className="w-full">Create Rule</Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
