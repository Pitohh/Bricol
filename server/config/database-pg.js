import pg from 'pg';
const { Pool } = pg;

// Configuration adaptative (local + production)
const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool(
  isProduction
    ? {
        // Production (Koyeb)
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      }
    : {
        // Development (local)
        host: 'localhost',
        port: 5432,
        database: 'bricol_dev',
        user: 'bricol_user',
        password: 'bricol_local_2024',
        ssl: false
      }
);

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL error:', err);
});

export default pool;
