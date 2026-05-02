import pg from 'pg';

const { Client } = pg;

async function createDb() {
  const client = new Client({
    connectionString: 'postgresql://postgres:1111@localhost:5432/postgres'
  });

  try {
    await client.connect();
    await client.query('CREATE DATABASE my_e_comm;');
    console.log('Database my_e_comm created successfully.');
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    await client.end();
  }
}

createDb();
