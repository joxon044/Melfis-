import pg from 'pg';

const { Pool } = pg;

let pool;

export function getPool() {
  if (!process.env.DATABASE_URL) {
    const error = new Error('Backend is not configured: DATABASE_URL is missing.');
    error.statusCode = 503;
    throw error;
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 5000,
      ...(process.env.NODE_ENV === 'production'
        ? { ssl: { rejectUnauthorized: false } }
        : {}),
    });
  }

  return pool;
}
