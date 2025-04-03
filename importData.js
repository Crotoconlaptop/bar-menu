import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pool from './db.js';
import dotenv from 'dotenv';
dotenv.config();


// 👇 Fix para __dirname con ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function insertDishes() {
  const filePath = path.join(__dirname, 'data/dishes.json');
  const rawData = fs.readFileSync(filePath, 'utf8');
  const dishes = JSON.parse(rawData); // <--- ESTO FALTABA

  for (const dish of dishes) {
    console.log(`→ Insertando ${dish.name} con imagen: ${dish.image_url}`);

    try {
      await pool.query(
        'INSERT INTO dishes (name, description, allergens, category, preparation_steps, image_url) VALUES ($1, $2, $3, $4, $5, $6)',
        [
          dish.name,
          dish.description,
          dish.allergens || [],
          dish.category || null,
          dish.preparation_steps || [],
          dish.image_url || null
        ]
      );
    } catch (err) {
      console.error(`❌ Error insertando ${dish.name}:`, err); // AHORA sí veremos el motivo
    }
  }

  console.log('✅ Dishes importados con imagenes');
}

insertDishes()
  .then(() => {
    console.log('🎉 ¡Datos cargados correctamente!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error en la carga de datos:', err);
    process.exit(1);
  });
