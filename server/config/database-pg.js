import pg from 'pg';
const { Pool } = pg;

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool(
  isProduction && process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      }
    : {
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
