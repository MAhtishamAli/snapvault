import test from 'node:test';
import assert from 'node:assert';
import { getProcessedPath } from '../lib/storage.js';

test('getProcessedPath generates valid path', () => {
    const filename = 'test-vid.webm';
    const result = getProcessedPath(filename);
    assert.ok(result.endsWith('test-vid_processed.mp4'));
});
