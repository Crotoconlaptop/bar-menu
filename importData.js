const fs = require('fs');
const path = require('path'); // ← ESTA LÍNEA FALTABA
const pool = require('./db');


async function insertDishes() {
    const filePath = path.join(__dirname, 'data/dishes.json');
    const rawData = fs.readFileSync(filePath, 'utf8');
    const dishes = JSON.parse(rawData);
  
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
        console.error(`❌ Error insertando ${dish.name}:`, err.message);
      }
    }
  
    console.log('✅ Dishes importados con imagenes');
  }
  
  async function main() {
    try {
      await insertDishes();
      console.log('🎉 ¡Datos cargados correctamente!');
      process.exit(0);
    } catch (err) {
      console.error('❌ Error en la carga de datos:', err.message);
      process.exit(1);
    }
  }
  
  main();
  