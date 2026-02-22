import Tesseract from 'tesseract.js';

/**
 * RegEx patterns for common PII / sensitive data.
 */
const PII_PATTERNS = [
    { type: 'email', regex: /[\w.+-]+@[\w.-]+\.\w{2,}/g },
    { type: 'api_key', regex: /(?:sk|pk|api|key|token|secret)[_-]?[A-Za-z0-9_-]{16,}/gi },
    { type: 'phone', regex: /\+?\d[\d\s\-()]{7,}\d/g },
    { type: 'ip_address', regex: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g },
    { type: 'credit_card', regex: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g },
];

/**
 * Detect PII in a single image frame using Tesseract OCR + RegEx.
 *
 * @param {string} imagePath — path to a PNG frame
 * @returns {Promise<{ text: string, bbox: { x: number, y: number, w: number, h: number }, type: string }[]>}
 */
export async function detectPII(imagePath) {
    const detections = [];

    try {
        const result = await Tesseract.recognize(imagePath, 'eng', {
            logger: () => { },  // Suppress verbose logging
        });

        const words = result.data.words || [];

        for (const word of words) {
            const text = word.text.trim();
            if (!text || text.length < 3) continue;

            for (const pattern of PII_PATTERNS) {
                // Reset the regex state for each test
                pattern.regex.lastIndex = 0;
                if (pattern.regex.test(text)) {
                    const { x0, y0, x1, y1 } = word.bbox;
                    detections.push({
                        text,
                        bbox: {
                            x: x0,
                            y: y0,
                            w: x1 - x0,
                            h: y1 - y0,
                        },
                        type: pattern.type,
                    });
                    break; // One match per word is enough
                }
            }
        }
    } catch (err) {
        console.error(`OCR failed for ${imagePath}:`, err.message);
    }

    return detections;
}

/**
 * Scan all extracted frames from a video and aggregate PII detections.
 * Returns deduplicated bounding boxes (merges overlapping regions).
 *
 * @param {string[]} framePaths — array of frame image paths
 * @returns {Promise<{ x: number, y: number, w: number, h: number }[]>}
 */
export async function scanVideoFrames(framePaths) {
    const allRegions = [];

    for (const framePath of framePaths) {
        const detections = await detectPII(framePath);
        for (const det of detections) {
            // Add padding around detected regions (20px each side)
            allRegions.push({
                x: Math.max(0, det.bbox.x - 20),
                y: Math.max(0, det.bbox.y - 20),
                w: det.bbox.w + 40,
                h: det.bbox.h + 40,
            });
        }
    }

    // Deduplicate overlapping regions
    return mergeOverlapping(allRegions);
}

/**
 * Merge overlapping bounding boxes into larger regions.
 */
function mergeOverlapping(regions) {
    if (regions.length <= 1) return regions;

    const merged = [];
    const used = new Set();

    for (let i = 0; i < regions.length; i++) {
        if (used.has(i)) continue;

        let current = { ...regions[i] };
        used.add(i);

        for (let j = i + 1; j < regions.length; j++) {
            if (used.has(j)) continue;

            if (overlaps(current, regions[j])) {
                current = mergeTwo(current, regions[j]);
                used.add(j);
            }
        }

        merged.push(current);
    }

    return merged;
}

function overlaps(a, b) {
    return !(
        a.x + a.w < b.x ||
        b.x + b.w < a.x ||
        a.y + a.h < b.y ||
        b.y + b.h < a.y
    );
}

function mergeTwo(a, b) {
    const x = Math.min(a.x, b.x);
    const y = Math.min(a.y, b.y);
    const right = Math.max(a.x + a.w, b.x + b.w);
    const bottom = Math.max(a.y + a.h, b.y + b.h);
    return { x, y, w: right - x, h: bottom - y };
}
