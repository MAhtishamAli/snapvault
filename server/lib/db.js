import Database from 'better-sqlite3';
import path from 'node:path';
import fse from 'fs-extra';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const storagePath = path.join(__dirname, '..', 'storage');
fse.ensureDirSync(storagePath);
const dbPath = path.join(storagePath, 'snapvault.db');

export const db = new Database(dbPath, { /* verbose: console.log */ });
db.pragma('journal_mode = WAL');

// Init schema
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password_hash TEXT,
        name TEXT,
        reset_code TEXT,
        reset_code_expires INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS snaps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        filename TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS recordings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        original_name TEXT,
        generated_name TEXT,
        processed_url TEXT,
        detections INTEGER DEFAULT 0,
        blurred INTEGER DEFAULT 0,
        duration INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS security_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        recording_id INTEGER,
        item_type TEXT,
        status TEXT, -- 'detected' or 'blurred'
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);
