const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const app = express();
const PORT = 3000;

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ Connected to MySQL');
});

app.use(express.json());

// Root test
app.get('/', (req, res) => {
  res.send('hi');
});

// Get all products
app.get('/products', (req, res) => {
  db.query('SELECT * FROM products WHERE is_deleted = 0', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get product by ID
app.get('/products/:id', (req, res) => {
  db.query('SELECT * FROM products WHERE id = ? AND is_deleted = 0', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0] || {});
  });
});

// Search product by keyword
app.get('/products/search/:keyword', (req, res) => {
  const keyword = `%${req.params.keyword}%`;
  db.query('SELECT * FROM products WHERE name LIKE ? AND is_deleted = 0', [keyword], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Soft delete product
app.delete('/products/:id', (req, res) => {
  db.query('UPDATE products SET is_deleted = 1 WHERE id = ?', [req.params.id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product soft-deleted' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
