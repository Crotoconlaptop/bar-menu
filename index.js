const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const pool = require('./db');

dotenv.config();

const app = express(); // ✅ Primero se crea `app`

app.use(cors());
app.use(express.json());
app.use('/images', express.static('images')); // ✅ Ahora sí podemos usar `app`

// Ruta raíz 👇
app.get('/', (req, res) => {
  res.send('🍽️ Bienvenido a la API del Bar. Usá /dishes o /drinks');
});

// Ruta de platos
app.get('/dishes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM dishes');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta de bebidas
app.get('/drinks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM drinks');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Puerto de escucha
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🔥 API corriendo en http://localhost:${PORT}`);
});
