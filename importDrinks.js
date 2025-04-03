import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pool from './db.js';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function insertDrinks() {
  const filePath = path.join(__dirname, 'data/drinks.json');
  const rawData = fs.readFileSync(filePath, 'utf8');
  const drinks = JSON.parse(rawData);

  for (const drink of drinks) {
    console.log(`→ Insertando ${drink.name} (${drink.category})`);

    try {
      await pool.query(
        'INSERT INTO drinks (name, description, category, image_url) VALUES ($1, $2, $3, $4)',
        [
          drink.name,
          drink.description,
          drink.category || null,
          drink.image_url || null
        ]
      );
    } catch (err) {
      console.error(`❌ Error insertando ${drink.name}:`, err);
    }
  }

  console.log('✅ Drinks importados');
}

insertDrinks()
  .then(() => {
    console.log('🎉 ¡Datos cargados correctamente!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error en la carga de datos:', err);
    process.exit(1);
  });
