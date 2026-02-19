import { motion } from 'framer-motion';
import { useState } from 'react';
import {
    Video, Search, Grid, List, Download, Trash2, Share2,
    Play, Clock, ShieldAlert, Eye, MoreVertical, Check, SortAsc
} from 'lucide-react';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import { pageTransition } from '../../animations/variants';

const allRecordings = [
    { id: 1, title: 'Sprint Planning Call', duration: '24:31', date: 'Feb 19, 2026', time: '2 hours ago', secrets: 3, gradient: 'from-indigo/20 to-purple-600/20', views: 12, size: '145 MB' },
    { id: 2, title: 'API Key Review Session', duration: '08:15', date: 'Feb 19, 2026', time: '5 hours ago', secrets: 7, gradient: 'from-crimson/20 to-orange-500/20', views: 5, size: '52 MB' },
    { id: 3, title: 'Bug Fix Walkthrough', duration: '12:42', date: 'Feb 18, 2026', time: 'Yesterday', secrets: 0, gradient: 'from-emerald/20 to-teal-600/20', views: 28, size: '78 MB' },
    { id: 4, title: 'Database Migration Demo', duration: '35:08', date: 'Feb 18, 2026', time: 'Yesterday', secrets: 2, gradient: 'from-blue-500/20 to-indigo/20', views: 8, size: '210 MB' },
    { id: 5, title: 'Deployment Pipeline', duration: '18:55', date: 'Feb 17, 2026', time: '2 days ago', secrets: 5, gradient: 'from-amber/20 to-yellow-600/20', views: 34, size: '115 MB' },
    { id: 6, title: 'Client Onboarding', duration: '41:20', date: 'Feb 16, 2026', time: '3 days ago', secrets: 1, gradient: 'from-pink-500/20 to-rose-500/20', views: 15, size: '248 MB' },
    { id: 7, title: 'Security Audit Review', duration: '55:12', date: 'Feb 15, 2026', time: '4 days ago', secrets: 12, gradient: 'from-red-500/20 to-pink-600/20', views: 42, size: '330 MB' },
    { id: 8, title: 'Team Standup Feb 15', duration: '15:03', date: 'Feb 15, 2026', time: '4 days ago', secrets: 0, gradient: 'from-teal-500/20 to-cyan-600/20', views: 6, size: '90 MB' },
];

export default function RecordingsPage({ onPlayVideo }) {
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [recordings, setRecordings] = useState(allRecordings);
    const [selectedIds, setSelectedIds] = useState(new Set());

    const filtered = recordings.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const toggleSelect = (id) => {
        setSelectedIds(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
    };

    const deleteSelected = () => {
        setRecordings(prev => prev.filter(r => !selectedIds.has(r.id)));
        setSelectedIds(new Set());
    };

    return (
        <motion.div
            {...pageTransition}
            className="space-y-8"
        >
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-text-primary flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-indigo-glow"><Video className="w-5 h-5 text-indigo" /></div>
                    Library
                </h1>
                <p className="text-sm text-text-faint mt-2">{recordings.length} recordings · 1.27 GB</p>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-base border border-border flex-1 max-w-xs transition-all focus-within:border-indigo/40">
                    <Search className="w-4 h-4 text-text-faint" />
                    <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className="bg-transparent text-sm text-text-primary placeholder:text-text-faint outline-none w-full" />
                </div>
                <div className="flex items-center rounded-xl border border-border overflow-hidden">
                    <button onClick={() => setViewMode('grid')} className={`p-2 transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-indigo-glow text-indigo' : 'text-text-faint hover:text-text-primary'}`}><Grid className="w-4 h-4" /></button>
                    <button onClick={() => setViewMode('list')} className={`p-2 transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-indigo-glow text-indigo' : 'text-text-faint hover:text-text-primary'}`}><List className="w-4 h-4" /></button>
                </div>
                {selectedIds.size > 0 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 ml-auto">
                        <span className="text-xs text-text-faint">{selectedIds.size} selected</span>
                        <Button variant="danger" size="sm" onClick={deleteSelected}><Trash2 className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="sm"><Download className="w-3.5 h-3.5" /></Button>
                    </motion.div>
                )}
            </div>

            {/* Content */}
            {filtered.length === 0 ? (
                <EmptyState type="recordings" />
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filtered.map((video, i) => (
                        <motion.div
                            key={video.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            whileHover={{ y: -4 }}
                            className="group rounded-2xl bg-surface border border-border overflow-hidden cursor-pointer card-hover"
                            onClick={() => onPlayVideo(video)}
                        >
                            <div className={`relative aspect-video bg-gradient-to-br ${video.gradient}`}>
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all flex items-center justify-center">
                                    <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                                    </div>
                                </div>
                                <div className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded-lg bg-black/60 text-[10px] font-medium text-white flex items-center gap-1.5"><Clock className="w-3 h-3" />{video.duration}</div>
                                {video.secrets > 0 && <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded-lg bg-crimson/85 text-[10px] font-semibold text-white flex items-center gap-1.5"><ShieldAlert className="w-3 h-3" />{video.secrets}</div>}
                                <button onClick={e => { e.stopPropagation(); toggleSelect(video.id); }}
                                    className={`absolute top-2.5 right-2.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${selectedIds.has(video.id) ? 'bg-indigo border-indigo' : 'border-white/30 bg-black/20 opacity-0 group-hover:opacity-100'}`}>
                                    {selectedIds.has(video.id) && <Check className="w-3 h-3 text-white" />}
                                </button>
                            </div>
                            <div className="p-4">
                                <h3 className="text-sm font-semibold text-text-primary group-hover:text-indigo transition-colors line-clamp-1">{video.title}</h3>
                                <div className="flex items-center gap-4 mt-2 text-xs text-text-faint">
                                    <span>{video.time}</span><span>{video.size}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="space-y-2">
                    {filtered.map((video, i) => (
                        <motion.div key={video.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                            className="flex items-center gap-5 p-4 rounded-2xl bg-surface border border-border hover:border-indigo/20 transition-all cursor-pointer group"
                            onClick={() => onPlayVideo(video)}>
                            <button onClick={e => { e.stopPropagation(); toggleSelect(video.id); }}
                                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${selectedIds.has(video.id) ? 'bg-indigo border-indigo' : 'border-border-subtle hover:border-text-muted'}`}>
                                {selectedIds.has(video.id) && <Check className="w-3 h-3 text-white" />}
                            </button>
                            <div className={`w-20 h-12 rounded-xl bg-gradient-to-br ${video.gradient} flex items-center justify-center flex-shrink-0`}>
                                <Play className="w-4 h-4 text-white/60" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-text-primary group-hover:text-indigo transition-colors truncate">{video.title}</h3>
                                <p className="text-xs text-text-faint mt-1">{video.date}</p>
                            </div>
                            <span className="text-xs text-text-faint font-mono">{video.duration}</span>
                            <span className="text-xs text-text-faint">{video.size}</span>
                            {video.secrets > 0 && <span className="text-xs text-crimson flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5" />{video.secrets}</span>}
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
