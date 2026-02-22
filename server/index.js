import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import multer from 'multer';
import path from 'node:path';
import fse from 'fs-extra';
import process from 'node:process';
import { ensureStorageDirs, saveUpload, PROCESSED_DIR, RAW_DIR } from './lib/storage.js';
import { runPipeline } from './lib/pipeline.js';
import authRoutes, { requireAuth } from './routes/auth.js';
import { db } from './lib/db.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*', // Allow all for local dev
        methods: ['GET', 'POST']
    }
});

// Important: allow crossOriginResourcePolicy for locally serving video files to frontend
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(express.json());

// Serve processed files statically
app.use('/processed', express.static(PROCESSED_DIR));

// Setup multer for temporary uploads
fse.ensureDirSync('storage/tmp');
const upload = multer({ dest: 'storage/tmp/' });

// Auth routes
app.use('/api/auth', authRoutes);

// ===== Protected Endpoints =====

app.post('/api/upload', requireAuth, upload.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Move the uploaded file to 'raw' directory (renames with original extension)
        await saveUpload(req.file);

        res.json({ success: true, filename: req.file.originalname });
    } catch (err) {
        console.error('Upload Error:', err);
        res.status(500).json({ error: 'Failed to save upload' });
    }
});

app.post('/api/process', requireAuth, async (req, res) => {
    const { filename, blurZones = [], socketId } = req.body;

    if (!filename) {
        return res.status(400).json({ error: 'filename is required' });
    }

    const rawFilePath = path.join(RAW_DIR, filename);

    // Validate file exists
    if (!fse.existsSync(rawFilePath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    try {
        // Status emitter closure
        const onStatus = (status, progress) => {
            if (socketId) {
                // Find target socket and emit
                const targetSocket = io.sockets.sockets.get(socketId);
                if (targetSocket) {
                    targetSocket.emit('processing:status', { status, progress });
                }
            } else {
                console.log(`[Processing ${filename}] ${progress}% : ${status}`);
            }
        };

        const result = await runPipeline(rawFilePath, blurZones, onStatus);

        // Save to DB
        const processedUrl = `/processed/${path.basename(result.outputPath)}`;

        let duration = 0; // TODO: extract duration if possible, mock for now
        let blurred = blurZones.length;

        const info = db.prepare('INSERT INTO recordings (user_id, original_name, generated_name, processed_url, detections, blurred, duration) VALUES (?, ?, ?, ?, ?, ?, ?)')
            .run(req.user.id, filename, path.basename(result.outputPath), processedUrl, result.detections, blurred, duration);

        res.json({ success: true, processedUrl, detections: result.detections, recordingId: info.lastInsertRowid });

    } catch (err) {
        console.error('Pipeline Error:', err);

        if (socketId) {
            const targetSocket = io.sockets.sockets.get(socketId);
            if (targetSocket) {
                targetSocket.emit('processing:error', { error: err.message });
            }
        }

        res.status(500).json({ error: err.message });
    }
});

// Dashboard & History Tracking
app.get('/api/dashboard', requireAuth, (req, res) => {
    // Generate some real stats from db
    const snapshots = db.prepare('SELECT COUNT(*) as count FROM snaps WHERE user_id = ?').get(req.user.id).count;
    const recordings = db.prepare('SELECT SUM(detections) as totalDet, SUM(blurred) as totalBlur, SUM(duration) as totalDur FROM recordings WHERE user_id = ?').get(req.user.id);
    const totalDetections = recordings.totalDet || 0;
    const totalBlurred = recordings.totalBlur || 0;

    // Privacy mix and Security pulse can be mocked based on total detections for now
    const mix = [
        { name: 'API Keys', value: totalDetections > 0 ? totalDetections : 1, fill: '#06b6d4' },
        { name: 'Emails', value: totalDetections > 0 ? Math.floor(totalDetections / 2) : 2, fill: '#10b981' },
        { name: 'Passwords', value: 0, fill: '#4f46e5' },
    ];

    res.json({
        success: true,
        stats: {
            snaps: snapshots,
            detections: totalDetections,
            blurred: totalBlurred,
            recordings: db.prepare('SELECT COUNT(*) as count FROM recordings WHERE user_id = ?').get(req.user.id).count,
            privacyMix: mix
        }
    });
});

app.get('/api/recordings', requireAuth, (req, res) => {
    const list = db.prepare('SELECT * FROM recordings WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    res.json({ success: true, recordings: list });
});

app.post('/api/snaps/upload', requireAuth, upload.single('snap'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file' });
    try {
        await fse.move(req.file.path, path.join(PROCESSED_DIR, req.file.originalname), { overwrite: true });
        const url = `/processed/${req.file.originalname}`;
        db.prepare('INSERT INTO snaps (user_id, filename) VALUES (?, ?)')
            .run(req.user.id, req.file.originalname);
        res.json({ success: true, url });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ===== Socket.IO Connection =====

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// ===== Start Server =====

const PORT = process.env.PORT || 3001;

ensureStorageDirs().then(() => {
    httpServer.listen(PORT, () => {
        console.log(`🚀 SnapVault Pro Backend running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to initialize storage directories:', err);
    process.exit(1);
});
