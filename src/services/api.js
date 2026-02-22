import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Upload a raw video Blob to the backend.
 * @param {Blob} blob
 * @param {string} filename
 * @param {Function} onProgress
 * @returns {Promise<string>}
 */
export async function uploadRecording(blob, filename, onProgress) {
    const formData = new FormData();
    formData.append('video', blob, filename);

    const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(percentCompleted);
            }
        },
    });

    return response.data.filename;
}

/**
 * Trigger the processing pipeline on the uploaded file.
 * @param {string} filename - The uploaded filename
 * @param {Array<{ x, y, w, h }>} blurZones - Manual blur coordinates
 * @param {string} socketId - Socket ID to receive progress events
 * @returns {Promise<{ processedUrl: string, detections: number }>}
 */
export async function processRecording(filename, blurZones = [], socketId) {
    const response = await axios.post(`${API_URL}/process`, {
        filename,
        blurZones,
        socketId,
    });

    return response.data;
}
