import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { pool } from './pool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setup() {
  const schema = await readFile(join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(schema);
  console.log('Database schema is ready.');
}

setup()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
