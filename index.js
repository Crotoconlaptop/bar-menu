// index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pool from './db.js'; // Asegúrate que db.js también use `export default`

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/images', express.static('images'));

app.get('/', (req, res) => {
  res.send('🍽️ Bienvenido a la API del Bar. Usá /dishes o /drinks');
});

app.get('/dishes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM dishes');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/drinks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM drinks');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🔥 API corriendo en http://localhost:${PORT}`);
});
