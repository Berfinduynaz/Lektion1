import { neon } from '@neondatabase/serverless';
import { DATABASE_URL } from '$env/static/private';

export async function load() {
  const sql = neon(DATABASE_URL);

  const response = await sql`SELECT version()`;
  const { version } = response[0];

  return {
    version
  };
}