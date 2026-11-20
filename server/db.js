import pg from 'pg';

const { Pool } = pg;

let pool;
let isDbInitialized = false;

export function getPool() {
  const connectionString = 
    process.env.DATABASE_URL || 
    process.env.POSTGRES_URL || 
    process.env.POSTGRES_PRISMA_URL || 
    process.env.POSTGRES_URL_NON_POOLING;

  if (!connectionString) {
    const error = new Error('Backend is not configured: DATABASE_URL is missing.');
    error.statusCode = 503;
    throw error;
  }

  if (!pool) {
    pool = new Pool({
      connectionString,
      max: 5,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 5000,
      ...(process.env.NODE_ENV === 'production' || connectionString.includes('sslmode=require') || connectionString.includes('vercel-storage') || connectionString.includes('neon.tech')
        ? { ssl: { rejectUnauthorized: false } }
        : {}),
    });
  }

  return pool;
}

export async function ensureDbInitialized() {
  if (isDbInitialized) return;
  try {
    const p = getPool();
    await p.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        balance BIGINT NOT NULL DEFAULT 500000,
        role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      ALTER TABLE users ADD COLUMN IF NOT EXISTS balance BIGINT NOT NULL DEFAULT 500000;
      CREATE TABLE IF NOT EXISTS sessions (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    isDbInitialized = true;
  } catch (err) {
    console.warn('Could not auto-initialize DB schema:', err.message);
  }
}
