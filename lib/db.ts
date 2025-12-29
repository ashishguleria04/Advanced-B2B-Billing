import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
// Schema will be created in the next step
import * as schema from './schema';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle(pool, { schema });
