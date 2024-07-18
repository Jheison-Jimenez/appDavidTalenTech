const express = require('express');
const dotenv = require('dotenv');
const pool = require('./db');
const app = express();
dotenv.config();

app.use(express.json());

app.get('/api/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM my_table');
    res.json(result.rows);
  } catch (err) {
    console.error('Error querying database:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/data', async (req, res) => {
  const { name, value } = req.body;
  try {
    const result = await pool.query('INSERT INTO my_table (name, value) VALUES ($1, $2) RETURNING *', [name, value]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, (err) => {
  if (err) {
    console.error('Error starting server:', err);
  } else {
    console.log(`localhost:${port}`);
  }
});
