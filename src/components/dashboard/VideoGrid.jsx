import { motion } from 'framer-motion';
import { Play, ShieldAlert, Clock, Eye, Film } from 'lucide-react';
import { staggerItem } from '../../animations/variants';

import { useDashboardData } from '../../hooks/useDashboardData';

function VideoCard({ video, onClick, index }) {
    return (
        <motion.div
            {...staggerItem}
            transition={{ duration: 0.35, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="group rounded-2xl glass card-hover overflow-hidden cursor-pointer"
            onClick={() => onClick?.(video)}
        >
            {/* 16:9 Thumbnail */}
            <div className={`relative aspect-video bg-gradient-to-br ${video.gradient}`}>
                {/* Grid pattern for depth */}
                <div className="absolute inset-0 opacity-[0.07]"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

                {/* Hover play overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300 flex items-center justify-center">
                    <motion.div
                        className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/20"
                        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}
                    >
                        <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                    </motion.div>
                </div>

                {/* Duration */}
                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 text-[10px] font-semibold text-white flex items-center gap-1 backdrop-blur-sm">
                    <Clock className="w-3 h-3" />{video.duration}
                </div>

                {/* Secrets badge */}
                {video.secrets > 0 && (
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-crimson/85 text-[10px] font-semibold text-white flex items-center gap-1 shadow-sm">
                        <ShieldAlert className="w-3 h-3" />{video.secrets} Hidden
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                    {video.title}
                </h3>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-text-faint">
                    <span>{new Date(video.created_at).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{video.views || 0}</span>
                    <span>{video.size || 'N/A'}</span>
                </div>
            </div>
        </motion.div>
    );
}

export default function VideoGrid({ onPlayVideo }) {
    const { recordings } = useDashboardData();

    // Map DB format to UI format
    const displayVideos = recordings.slice(0, 6).map((rec, i) => {
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
            gradient: gradients[i % gradients.length]
        };
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary-glow">
                        <Film className="w-4 h-4 text-primary" strokeWidth={1.8} />
                    </div>
                    <h2 className="text-sm font-semibold text-text-primary">Recent Recordings</h2>
                </div>
                <button className="text-xs text-primary hover:text-primary-hover font-semibold transition-colors cursor-pointer">
                    View All →
                </button>
            </div>

            {displayVideos.length === 0 ? (
                <div className="text-center p-8 bg-surface-raised rounded-xl text-text-muted text-sm border border-border">
                    No recordings yet. Connect and take a snap or start recording!
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 fluid-gap">
                    {displayVideos.map((video, i) => (
                        <VideoCard key={video.id} video={video} onClick={onPlayVideo} index={i} />
                    ))}
                </div>
            )}
        </div>
    );
}
