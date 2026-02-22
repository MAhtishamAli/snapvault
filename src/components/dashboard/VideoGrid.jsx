import { motion } from 'framer-motion';
import { Play, ShieldAlert, Clock, Eye, Film } from 'lucide-react';
import { staggerItem } from '../../animations/variants';

const mockVideos = [
    { id: 1, title: 'Sprint Planning Call', duration: '24:31', date: '2 hours ago', secrets: 3, gradient: 'from-violet-600/30 to-primary/20', views: 12, size: '145 MB' },
    { id: 2, title: 'API Key Review Session', duration: '08:15', date: '5 hours ago', secrets: 7, gradient: 'from-rose-600/25 to-orange-500/15', views: 5, size: '52 MB' },
    { id: 3, title: 'Bug Fix Walkthrough', duration: '12:42', date: 'Yesterday', secrets: 0, gradient: 'from-emerald/25 to-teal/15', views: 28, size: '78 MB' },
    { id: 4, title: 'Database Migration Demo', duration: '35:08', date: 'Yesterday', secrets: 2, gradient: 'from-blue-600/25 to-teal/20', views: 8, size: '210 MB' },
    { id: 5, title: 'Deployment Pipeline', duration: '18:55', date: '2 days ago', secrets: 5, gradient: 'from-amber-500/25 to-yellow-500/15', views: 34, size: '115 MB' },
    { id: 6, title: 'Client Onboarding', duration: '41:20', date: '3 days ago', secrets: 1, gradient: 'from-pink-600/25 to-rose-500/15', views: 15, size: '248 MB' },
];

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
                    <span>{video.date}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{video.views}</span>
                    <span>{video.size}</span>
                </div>
            </div>
        </motion.div>
    );
}

export default function VideoGrid({ onPlayVideo }) {
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 fluid-gap">
                {mockVideos.map((video, i) => (
                    <VideoCard key={video.id} video={video} onClick={onPlayVideo} index={i} />
                ))}
            </div>
        </div>
    );
}
