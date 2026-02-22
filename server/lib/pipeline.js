import path from 'node:path';
import { getFramesDir, getProcessedPath } from './storage.js';
import { extractFrames, applyBlurRegions, suppressNoise } from './ffmpeg.js';
import { scanVideoFrames } from './ai-detector.js';
import fse from 'fs-extra';

/**
 * Full processing pipeline for an uploaded recording.
 * Steps: extract frames → AI detect PII → apply blur → noise suppress → cleanup.
 *
 * @param {string} rawFilePath — path to the raw uploaded file
 * @param {{ x: number, y: number, w: number, h: number }[]} manualBlurZones — user-drawn blur regions
 * @param {(status: string, progress: number) => void} onStatus — callback for real-time status updates
 * @returns {Promise<{ outputPath: string, detections: number }>}
 */
export async function runPipeline(rawFilePath, manualBlurZones = [], onStatus = () => { }) {
    const filename = path.basename(rawFilePath);
    const framesDir = getFramesDir(filename);
    const processedPath = getProcessedPath(filename);

    // Temp file for intermediate processing
    const blurredTempPath = processedPath.replace('.mp4', '_blurred.mp4');

    let totalDetections = 0;

    try {
        // ── Step 1: Extract keyframes for AI analysis ──
        onStatus('Extracting video frames for AI analysis...', 10);
        let framePaths = [];
        try {
            framePaths = await extractFrames(rawFilePath, framesDir);
            onStatus(`Extracted ${framePaths.length} frames`, 25);
        } catch (err) {
            console.warn('Frame extraction failed (may not be a video file):', err.message);
            onStatus('Frame extraction skipped (file may be audio-only)', 25);
        }

        // ── Step 2: AI PII detection on frames ──
        let aiBlurRegions = [];
        if (framePaths.length > 0) {
            onStatus('Running AI privacy scan (OCR + pattern matching)...', 30);
            aiBlurRegions = await scanVideoFrames(framePaths);
            totalDetections = aiBlurRegions.length;
            onStatus(`AI detected ${totalDetections} sensitive region(s)`, 50);
        }

        // Merge AI detections with manual blur zones
        const allBlurRegions = [...aiBlurRegions, ...manualBlurZones];

        // ── Step 3: Apply blur overlay ──
        if (allBlurRegions.length > 0) {
            onStatus(`Applying privacy blur to ${allBlurRegions.length} region(s)...`, 55);
            await applyBlurRegions(rawFilePath, allBlurRegions, blurredTempPath);
            onStatus('Privacy blur applied', 70);
        } else {
            // No blur needed — copy as-is for next step
            await fse.copy(rawFilePath, blurredTempPath);
            onStatus('No sensitive regions found — skipping blur', 70);
        }

        // ── Step 4: Audio noise suppression ──
        onStatus('Applying audio noise suppression...', 75);
        try {
            await suppressNoise(blurredTempPath, processedPath);
            onStatus('Audio noise suppression complete', 90);
        } catch (err) {
            console.warn('Noise suppression failed, using unfiltered audio:', err.message);
            await fse.move(blurredTempPath, processedPath, { overwrite: true });
            onStatus('Noise suppression skipped (no audio track or FFmpeg issue)', 90);
        }

        // ── Step 5: Cleanup temp files ──
        onStatus('Finalizing...', 95);
        await fse.remove(blurredTempPath).catch(() => { });
        await fse.remove(framesDir).catch(() => { });

        onStatus('Processing complete!', 100);

        return {
            outputPath: processedPath,
            detections: totalDetections,
        };
    } catch (err) {
        // Cleanup on failure
        await fse.remove(blurredTempPath).catch(() => { });
        throw err;
    }
}
