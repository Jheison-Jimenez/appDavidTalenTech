const express = require('express');
const dotenv = require('dotenv');
const pool = require('./db');
const app = express();
dotenv.config();

app.use(express.json());

// Ruta para obtener todos los datos
app.get('/api/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM my_table');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Ruta para crear un nuevo dato
app.post('/api/data', async (req, res) => {
  const { name, value } = req.body;
  try {
    const result = await pool.query('INSERT INTO my_table (name, value) VALUES ($1, $2) RETURNING *', [name, value]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
