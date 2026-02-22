import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fse from 'fs-extra';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Base storage root */
export const STORAGE_ROOT = path.join(__dirname, '..', 'storage');
export const RAW_DIR = path.join(STORAGE_ROOT, 'raw');
export const PROCESSED_DIR = path.join(STORAGE_ROOT, 'processed');
export const FRAMES_DIR = path.join(STORAGE_ROOT, 'frames');

/**
 * Ensures all storage directories exist.
 */
export async function ensureStorageDirs() {
    await fse.ensureDir(RAW_DIR);
    await fse.ensureDir(PROCESSED_DIR);
    await fse.ensureDir(FRAMES_DIR);
}

/**
 * Moves an uploaded file (from multer tmp) into the raw storage directory.
 * @param {object} file — multer file object
 * @returns {Promise<string>} — final path inside raw/
 */
export async function saveUpload(file) {
    const dest = path.join(RAW_DIR, file.originalname);
    await fse.move(file.path, dest, { overwrite: true });
    return dest;
}

/**
 * Returns the processed output path for a given filename.
 * @param {string} filename
 */
export function getProcessedPath(filename) {
    const base = path.parse(filename).name;
    return path.join(PROCESSED_DIR, `${base}_processed.mp4`);
}

/**
 * Returns the frames output directory for a given video filename.
 * @param {string} filename
 */
export function getFramesDir(filename) {
    const base = path.parse(filename).name;
    const dir = path.join(FRAMES_DIR, base);
    fse.ensureDirSync(dir);
    return dir;
}
