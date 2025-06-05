import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pool from './db.js';

// Load environment variables
dotenv.config();

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
    try {
        console.log('Initializing database...');

        // Read SQL schema file
        const schemaFile = path.join(__dirname, 'schema.sql');
        const schemaSql = await readFile(schemaFile, 'utf8');

        // Execute SQL schema
        await pool.query(schemaSql);
        console.log('Database initialized successfully!');

        // Close connection pool
        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error.message);

        // Close connection pool
        await pool.end();
        process.exit(1);
    }
}

// Run the initialization
initDatabase();
