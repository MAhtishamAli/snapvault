import ffmpeg from 'fluent-ffmpeg';
import path from 'node:path';

/**
 * Apply audio noise suppression using FFmpeg filters.
 * Uses afftdn (adaptive frequency-domain temporal noise filter),
 * plus highpass/lowpass to isolate the speech band (200 Hz – 3000 Hz).
 *
 * @param {string} inputPath — path to the raw recording
 * @param {string} outputPath — path for the processed output
 * @returns {Promise<string>} — resolves with outputPath on success
 */
export function suppressNoise(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .audioFilters([
                'afftdn=nf=-25',       // Adaptive noise floor suppression
                'highpass=f=200',       // Remove rumble below 200 Hz
                'lowpass=f=3000',       // Remove hiss above 3 kHz
                'volume=1.5',           // Slight volume boost to compensate
            ])
            .outputOptions(['-c:v', 'copy'])  // Copy video stream unchanged
            .output(outputPath)
            .on('end', () => resolve(outputPath))
            .on('error', (err) => reject(new Error(`Noise suppression failed: ${err.message}`)))
            .run();
    });
}

/**
 * Apply Gaussian blur to specified rectangular regions in a video.
 * Each region is { x, y, w, h } in pixel coordinates.
 *
 * @param {string} inputPath
 * @param {{ x: number, y: number, w: number, h: number }[]} regions
 * @param {string} outputPath
 * @returns {Promise<string>}
 */
export function applyBlurRegions(inputPath, regions, outputPath) {
    if (!regions || regions.length === 0) {
        // No blur needed — just copy the file
        return new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .outputOptions(['-c', 'copy'])
                .output(outputPath)
                .on('end', () => resolve(outputPath))
                .on('error', (err) => reject(err))
                .run();
        });
    }

    // Build a complex filter chain that applies boxblur to each region
    // For each region: crop the area, blur it, overlay it back
    const filterParts = [];
    let lastLabel = '[0:v]';

    regions.forEach((r, i) => {
        const cropLabel = `[crop${i}]`;
        const blurLabel = `[blur${i}]`;
        const overlayLabel = i < regions.length - 1 ? `[ov${i}]` : `[vout]`;

        filterParts.push(
            `[0:v]crop=${r.w}:${r.h}:${r.x}:${r.y}${cropLabel}`,
            `${cropLabel}boxblur=20:5${blurLabel}`,
            `${lastLabel}${blurLabel}overlay=${r.x}:${r.y}${overlayLabel}`
        );
        lastLabel = overlayLabel;
    });

    const filterComplex = filterParts.join(';');

    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .complexFilter(filterComplex, 'vout')
            .outputOptions(['-c:a', 'copy'])
            .output(outputPath)
            .on('end', () => resolve(outputPath))
            .on('error', (err) => reject(new Error(`Blur failed: ${err.message}`)))
            .run();
    });
}

/**
 * Extract keyframes from a video for AI analysis.
 * Extracts 1 frame per second.
 *
 * @param {string} videoPath
 * @param {string} outputDir — directory to save frame PNGs
 * @returns {Promise<string[]>} — array of frame file paths
 */
export function extractFrames(videoPath, outputDir) {
    return new Promise((resolve, reject) => {
        const outputPattern = path.join(outputDir, 'frame_%04d.png');

        ffmpeg(videoPath)
            .outputOptions(['-vf', 'fps=1', '-q:v', '2'])
            .output(outputPattern)
            .on('end', async () => {
                // Read the directory to get all generated frames
                const { default: fse } = await import('fs-extra');
                const files = await fse.readdir(outputDir);
                const framePaths = files
                    .filter(f => f.startsWith('frame_') && f.endsWith('.png'))
                    .sort()
                    .map(f => path.join(outputDir, f));
                resolve(framePaths);
            })
            .on('error', (err) => reject(new Error(`Frame extraction failed: ${err.message}`)))
            .run();
    });
}
