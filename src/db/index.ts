import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const isNeon = process.env.DATABASE_URL.includes('neon.tech');

function getDb() {
  if (isNeon) {
    const { neon } = require('@neondatabase/serverless');
    const { drizzle } = require('drizzle-orm/neon-http');
    const sql = neon(process.env.DATABASE_URL!);
    return drizzle(sql, { schema });
  } else {
    const { Pool } = require('pg');
    const { drizzle } = require('drizzle-orm/node-postgres');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    return drizzle(pool, { schema });
  }
}

export const db = getDb();

