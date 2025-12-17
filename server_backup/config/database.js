import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, '../database.sqlite'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Créer les tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    role_label TEXT NOT NULL,
    specialty TEXT,
    permissions TEXT NOT NULL,
    color TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS project (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    total_budget REAL NOT NULL,
    start_date TEXT,
    end_date TEXT,
    created_by INTEGER,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS phases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER DEFAULT 1,
    phase_name TEXT NOT NULL,
    description TEXT,
    estimated_cost REAL DEFAULT 0,
    actual_cost REAL DEFAULT 0,
    progression INTEGER DEFAULT 0,
    status TEXT DEFAULT 'a_faire',
    start_date TEXT,
    end_date TEXT,
    validated_by INTEGER,
    validated_at DATETIME,
    approved_by INTEGER,
    approved_at DATETIME,
    assigned_to TEXT,
    phase_order INTEGER
  );

  CREATE TABLE IF NOT EXISTS sub_tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phase_id INTEGER NOT NULL,
    task_name TEXT NOT NULL,
    description TEXT,
    estimated_cost REAL DEFAULT 0,
    actual_cost REAL DEFAULT 0,
    progression INTEGER DEFAULT 0,
    status TEXT DEFAULT 'a_faire',
    start_date TEXT,
    end_date TEXT,
    validated_by INTEGER,
    validated_at DATETIME,
    report TEXT,
    task_order INTEGER,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (phase_id) REFERENCES phases(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sub_task_id INTEGER NOT NULL,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    mime_type TEXT,
    file_size INTEGER,
    uploaded_by INTEGER,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sub_task_id) REFERENCES sub_tasks(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS reactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phase_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    reaction_type TEXT CHECK(reaction_type IN ('like', 'dislike')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(phase_id, user_id),
    FOREIGN KEY (phase_id) REFERENCES phases(id) ON DELETE CASCADE
  );
`);

console.log('✅ Database initialized');

export default db;
