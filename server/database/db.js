import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = path.join(__dirname, 'geminicliui_auth.db');
const INIT_SQL_PATH = path.join(__dirname, 'init.sql');

// Initialize database with promise wrapper
const db = new sqlite3.Database(DB_PATH);

// Promisify database methods for easier async/await usage
const dbAsync = {
  run: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  },
  get: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

// Initialize database with schema
const initializeDatabase = async () => {
  try {
    const initSQL = fs.readFileSync(INIT_SQL_PATH, 'utf8');
    const statements = initSQL.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await dbAsync.run(statement);
      }
    }
    // console.log('Database initialized successfully');
  } catch (error) {
    // console.error('Error initializing database:', error.message);
    throw error;
  }
};

// User database operations
const userDb = {
  // Check if any users exist
  hasUsers: async () => {
    try {
      const row = await dbAsync.get('SELECT COUNT(*) as count FROM geminicliui_users');
      return row.count > 0;
    } catch (err) {
      throw err;
    }
  },

  // Create a new user
  createUser: async (username, passwordHash) => {
    try {
      const result = await dbAsync.run('INSERT INTO geminicliui_users (username, password_hash) VALUES (?, ?)', [username, passwordHash]);
      return { id: result.lastID, username };
    } catch (err) {
      throw err;
    }
  },

  // Get user by username
  getUserByUsername: async (username) => {
    try {
      const row = await dbAsync.get('SELECT * FROM geminicliui_users WHERE username = ? AND is_active = 1', [username]);
      return row;
    } catch (err) {
      throw err;
    }
  },

  // Update last login time
  updateLastLogin: async (userId) => {
    try {
      await dbAsync.run('UPDATE geminicliui_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [userId]);
    } catch (err) {
      throw err;
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const row = await dbAsync.get('SELECT id, username, created_at, last_login FROM geminicliui_users WHERE id = ? AND is_active = 1', [userId]);
      return row;
    } catch (err) {
      throw err;
    }
  }
};

export {
  dbAsync as db,
  initializeDatabase,
  userDb
};