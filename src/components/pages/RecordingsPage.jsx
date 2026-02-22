import { motion } from 'framer-motion';
import { useState } from 'react';
import {
    Video, Search, Grid, List, Download, Trash2, Share2,
    Play, Clock, ShieldAlert, Eye, MoreVertical, Check, SortAsc
} from 'lucide-react';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import { pageTransition } from '../../animations/variants';

import { useDashboardData } from '../../hooks/useDashboardData';

export default function RecordingsPage({ onPlayVideo }) {
    const { recordings: dbRecordings } = useDashboardData();
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState(new Set());

    const displayVideos = dbRecordings.map((rec, i) => {
        const gradients = [
            'from-violet-600/30 to-primary/20',
            'from-rose-600/25 to-orange-500/15',
            'from-emerald/25 to-teal/15',
            'from-blue-600/25 to-teal/20',
            'from-amber-500/25 to-yellow-500/15',
            'from-pink-600/25 to-rose-500/15'
        ];
        return {
            ...rec,
            title: rec.original_name,
            duration: rec.duration ? `${Math.floor(rec.duration / 60)}:${(rec.duration % 60).toString().padStart(2, '0')}` : '00:00',
            secrets: rec.detections,
            gradient: gradients[i % gradients.length],
            time: new Date(rec.created_at).toLocaleDateString(),
            date: new Date(rec.created_at).toLocaleDateString(),
            views: 0,
            size: rec.size || 'N/A'
        };
    });

    const filtered = displayVideos.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const toggleSelect = (id) => {
        setSelectedIds(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
    };

    const deleteSelected = () => {
        // Mock UI deletion for now
        // TODO: call backend to delete
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
                <p className="text-sm text-text-faint mt-2">{displayVideos.length} recordings</p>
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
