import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a PostgreSQL connection pool
// const connectionString = "postgresql://postgres:root123@localhost:5432/event_manager";
const connectionString = process.env.DATABASE_URL;

const pool = new pg.Pool({
    connectionString
});

// Test the database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Database connected successfully at:', res.rows[0].now);
    }
});

export const query = async (text, params = []) => {
    try {
        const start = Date.now();
        const res = await pool.query(text, params);
        const duration = Date.now() - start;

        if (process.env.NODE_ENV === 'development') {
            console.log('Executed query:', { text, duration, rows: res.rowCount });
        }

        return res;
    } catch (error) {
        console.error('Query error:', error.message);
        throw error;
    }
};

export default pool;
