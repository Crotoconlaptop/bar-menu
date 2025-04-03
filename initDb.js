const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const createTables = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Crear tabla dishes
    await client.query(`
      CREATE TABLE IF NOT EXISTS dishes (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT,
        allergens TEXT[],
        preparation_steps TEXT[],
        image_url TEXT
      );
    `);

    // Crear tabla drinks
    await client.query(`
      CREATE TABLE IF NOT EXISTS drinks (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT,
        tags TEXT[],
        image_url TEXT
      );
    `);

    await client.query('COMMIT');
    console.log('Tablas creadas exitosamente.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear las tablas:', error);
  } finally {
    client.release();
  }
};

createTables().catch((err) => console.error('Error en createTables:', err));
