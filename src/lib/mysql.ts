
import mysql from 'mysql2/promise';

// It's generally recommended to use a connection pool for web applications
// rather than creating new connections for every query.
let pool: mysql.Pool | null = null;

function getPool() {
  if (pool) {
    return pool;
  }

  if (
    !process.env.MYSQL_HOST ||
    !process.env.MYSQL_USER ||
    !process.env.MYSQL_PASSWORD ||
    !process.env.MYSQL_DATABASE
  ) {
    throw new Error('MySQL environment variables are not fully set.');
  }

  pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT, 10) : 3306,
    waitForConnections: true,
    connectionLimit: 10, // Adjust as needed
    queueLimit: 0,
  });
  console.log('MySQL connection pool created.');
  return pool;
}

// Export a query function that uses the pool
export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  const dbPool = getPool();
  try {
    const [results] = await dbPool.execute(sql, params);
    return results as T;
  } catch (error) {
    console.error('MySQL Query Error:', error);
    // Rethrow or handle as appropriate for your application
    throw new Error('Database query failed.');
  }
}

// Optional: Function to close the pool when the application shuts down
// This might be useful in some environments, but Next.js serverless functions
// have a different lifecycle.
export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('MySQL connection pool closed.');
  }
}

// Example of how you might use this:
// import { query } from '@/lib/mysql';
// const users = await query('SELECT * FROM users');
